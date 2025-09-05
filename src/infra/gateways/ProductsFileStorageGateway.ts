import { Product } from '@application/entities/Product';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client } from '@infra/clients/s3Client';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutosToSeconds } from '@shared/utils/minutesToSeconds';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsFileStorageGateway {
  constructor(private readonly config: AppConfig) { }

  // static allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];

  // static extractExtension(contentType: string): string {
  //   const ext = contentType.split('/')[1];
  //   if (!this.allowedExtensions.includes(ext)) {
  //     throw new Error(`Invalid content-type: ${contentType}`);
  //   }
  //   return ext;
  // }

  static generateInputFileKey({
    storeId,
    inputType,
  }: ProductsFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Product.InputType.PICTURE ? 'jpeg' : '';

    const fileName = `${randomUUID()}.${extension}`;

    return `${storeId}/${fileName}`;
  }

  async createPOST({
    file,
    productId,
  }: ProductsFileStorageGateway.CreatePOSTParams): Promise<ProductsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.productsBucket;
    const contentType = file.inputType === Product.InputType.PICTURE ? 'image/jpeg' : 'audio/m4a';

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutosToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-productId': productId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');

    return {
      uploadSignature,
    };
  }

  async deleteFile({
    fileKey,
  }: ProductsFileStorageGateway.DeleteFileParams): Promise<void> {
    const bucket = this.config.storage.productsBucket;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);

  }

}

export namespace ProductsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    storeId: string;
    inputType: string;
  }

  export type CreatePOSTParams = {
    productId: string;
    file: {
      key: string;
      size: number,
      inputType: string;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string
  }

  export type DeleteFileParams = {
    fileKey: string;
  }
}
