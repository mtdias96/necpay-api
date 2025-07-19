import { Product } from '@application/entities/Product';
import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute({
    accountId,
    storeId,
    file,
    product,
  }: CreateProductUseCase.Input): Promise<CreateProductUseCase.Output> {

    const inputFileKey = ProductsFileStorageGateway.generateInputFileKey({
      accountId,
      storeId,
      inputType: file.inputType,
    });

    const newProduct = new Product({
      ...product,
      storeId,
      status: Product.Status.UPLOADING,
      inputFileKey,
      inputType: file.inputType,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.productRepository.create(newProduct),
      this.productsFileStorageGateway.createPOST({
        productId: newProduct.id,
        file: {
          key: inputFileKey,
          size: file.size,
          inputType: file.inputType,
        },
      }),
    ]);

    return {
      productId: newProduct.id,
      uploadSignature,
    };
  }
}

export namespace CreateProductUseCase {
  export type Input = {
    accountId: string;
    storeId: string;
    product: {
      categoryId: string;
      name: string;
      costPrice: number;
      currentStock: number;
      price: number;
      stockAlert: number;
      barcode: string | undefined
      description: string
    }
    file: {
      inputType: Product.InputType;
      size: number;
    }
  };

  export type Output = {
    productId: string;
    uploadSignature: string
  };
}
