import { Product } from '@application/entities/Product';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client } from '@infra/clients/s3Client';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutosToSeconds } from '@shared/utils/minutesToSeconds';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryFileStorageGateway {
  constructor(private readonly config: AppConfig) { }

  static generateInputFileKey({
    storeId,
    inputType,
  }: CategoryFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Product.InputType.PICTURE ? 'jpeg' : '';

    const fileName = `${randomUUID()}.${extension}`;

    return `${storeId}/${fileName}`;
  }

  async createPOST({
    file,
    categoryId,
  }: CategoryFileStorageGateway.CreatePOSTParams): Promise<CategoryFileStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.categoryBucket;
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
        'x-amz-meta-productId': categoryId,
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

}

export namespace CategoryFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    storeId: string;
    inputType: string;
  }

  export type CreatePOSTParams = {
    categoryId: string;
    file: {
      key: string;
      size: number,
      inputType: string;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string
  }
}
