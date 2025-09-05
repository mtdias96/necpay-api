import { Product } from '@application/entities/Product';
import { ProductAlreadyInUse } from '@application/errors/application/ProductAlreadyExists';
import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { CreateProductUnitOfWork } from '@infra/database/drizzle/uow/CreateProductUnitOfWork';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
    private readonly createProductUnitOfWork: CreateProductUnitOfWork,
  ) { }

  async execute({
    storeId,
    file,
    product,
  }: CreateProductUseCase.Input): Promise<CreateProductUseCase.Output> {

    const productExists = await this.productRepository.findByName(storeId, product.name);

    if (productExists) {
      throw new ProductAlreadyInUse();
    }

    const inputFileKey = ProductsFileStorageGateway.generateInputFileKey({
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
      this.createProductUnitOfWork.run(newProduct),
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
