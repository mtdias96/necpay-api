import { Product } from '@application/entities/Product';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  async execute({
    storeId,
    productId,
  }: GetProductByIdUseCase.Input): Promise<GetProductByIdUseCase.Output> {
    const product = await this.productRepository.findById(storeId, productId);

    if (!product) {
      throw new ResourceNotFound('product not found.');
    }

    return {
      product: {
        id: product.id,
        storeId: product.storeId,
        categoryId: product.categoryId,
        name: product.name,
        price: Number(product.price),
        status: product.status as Product.Status,
        inputType: product.inputType as Product.InputType,
        costPrice: Number(product.costPrice),
        currentStock: product.currentStock,
        stockAlert: product.stockAlert,
        inputFileKey: product.inputFileKey ?? '',
        barcode: product.barcode ?? '',
        description: product.description ?? '',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };
  }
}

export namespace GetProductByIdUseCase {
  export type Input = {
    storeId: string,
    productId: string,
  };

  export type Output = {
    product: {
      id: string;
      storeId: string;
      categoryId: string;
      status: Product.Status;
      inputType: Product.InputType;
      name: string;
      price: number;
      costPrice: number;
      currentStock: number;
      stockAlert: number;
      inputFileKey: string;
      barcode?: string;
      description?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  };
}
