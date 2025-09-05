import { UpdateProductBody } from '@application/controllers/product/schemas/updateProductSchema';
import { Product } from '@application/entities/Product';
import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute({
    storeId,
    productId,
    productUpdate,
    fileUpdate,
  }: UpdateProductUseCase.Input) {

    const productExists = await this.productRepository.findById(storeId, productId);

    if (!productExists) {
      throw new Error('Produto não encontrado');
    }

    if (fileUpdate?.type && fileUpdate?.size) {
      const inputFileKey = ProductsFileStorageGateway.generateInputFileKey({
        storeId,
        inputType: Product.InputType.PICTURE,
      });

      const [{ uploadSignature }] = await Promise.all([
        this.productsFileStorageGateway.createPOST({
          productId,
          file: {
            key: inputFileKey,
            size: fileUpdate.size,
            inputType: Product.InputType.PICTURE,
          },
        }),

        this.productsFileStorageGateway.deleteFile({
          fileKey: productExists.inputFileKey as string,
        }),

        this.productRepository.update({
          productId,
          storeId,
          productUpdate: {
            ...productUpdate,
            inputFileKey,
          },
        }),

      ]);

      return { uploadSignature };
    }

    await this.productRepository.update({
      productId,
      storeId,
      productUpdate,
    });
  }
}

export namespace UpdateProductUseCase {
  export type Input = {
    storeId: string;
    productId: string;
    fileUpdate?: Partial<{
      type: string;
      size: number;
    }>
    productUpdate: Partial<UpdateProductBody['productUpdate']>
  };

  export type Output = { uploadSignature: string } | null
}
