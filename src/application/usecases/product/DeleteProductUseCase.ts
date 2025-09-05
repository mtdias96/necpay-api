
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) {}

  async execute({
    storeId,
    productId,
  }: DeleteProductUseCase.Input): Promise<void> {
    const productExists = await this.productRepository.findById(storeId, productId);

    if (!productExists) {
      throw new ResourceNotFound(
        `Product with id ${productId} not found for store ${storeId}`,
      );
    }

    await Promise.all([
      this.productsFileStorageGateway.deleteFile({
        fileKey: productExists.inputFileKey as string,
      }),
      this.productRepository.delete(productId, storeId),
    ]);
  }
}

export namespace DeleteProductUseCase {
  export type Input = {
    storeId: string;
    productId: string;
  };
}
