import { MethodPayment } from '@application/controllers/order/schemas/placeOrderSchema';
import { Order } from '@application/entities/Order';
import { OrderItem } from '@application/entities/OrderItem';
import { StockMovement } from '@application/entities/StockMovement';
import { InsufficientStock } from '@application/errors/application/InsufficientStock';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { OrderCalculateService } from '@application/services/OrderCalculateService';

import { ProductRepository } from '@infra/database/drizzle/repositories/ProductRepository';
import { PlaceOrderUnitOfWork } from '@infra/database/drizzle/uow/PlaceOrderUnitOfWork';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly placeOrderUnitOfWork: PlaceOrderUnitOfWork,

  ) { }

  async execute({ accountId, storeId, saleOrder, methodPayment }: PlaceOrderUseCase.Input) {
    const productsId: string[] = saleOrder.map(product => product.productId);

    const productResult = await this.productRepository.findProductStockByIds(storeId, productsId);

    /*
    Atualmente temos uma venda por vez,
    caso tenha multiplas vendas ao mesmo tempo,
    mudar a logica de validação de stock para a transaction
    */
    const stockById = new Map<PlaceOrderUseCase.ProductId, PlaceOrderUseCase.CurrentStock>(productResult.map((p) => [p.id, p.currentStock]));

    const productById = new Map<PlaceOrderUseCase.ProductId, PlaceOrderUseCase.Product>(
      productResult.map(p => [p.id, p]),
    );

    for (const item of saleOrder) {
      const availableStock = stockById.get(item.productId) ?? 0;

      if (item.quantity > availableStock) {
        const product = productById.get(item.productId);
        throw new InsufficientStock(product?.name ?? 'Produto desconhecido', availableStock, item.quantity);
      }
    }

    const saleCart = saleOrder.map(item => {
      const product = productById.get(item.productId);

      if (!product) {
        throw new ResourceNotFound(`Produto com ID ${item.productId} não encontrado.`);
      }

      return {
        price: Number(product.price),
        quantity: item.quantity,
        methodPayment: methodPayment,
      };
    });

    const calculateOrder = OrderCalculateService.calculate({
      saleCart,
    });

    const order = new Order({
      storeId,
      operatorId: accountId,
      total: calculateOrder.total,
      totalItems: calculateOrder.items,
      methodPayment,
      paymentStatus: Order.PaymentStatus.PAID,
      status: Order.Status.COMPLETED,
    });

    const orderItems: OrderItem[] = saleOrder.map(item => {
      const product = productById.get(item.productId)!;

      const orderItem = new OrderItem({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        unitPrice: Number(product.price),
        quantity: item.quantity,
      });

      return orderItem;
    });

    const stockMovements: StockMovement[] = saleOrder.map(item => {
      const product = productById.get(item.productId)!;
      return new StockMovement({
        storeId,
        productId: product.id,
        type: StockMovement.Type.EXIT,
        quantity: item.quantity,
        costPrice: Number(product.price),
      });
    });

    await this.placeOrderUnitOfWork.run(storeId, order, orderItems, stockMovements);

    return {
      orderId: order.id,
      total: calculateOrder.total,
      items: calculateOrder.items,
      status: order.status,
      paymentStatus: order.paymentStatus,
    };
  }

}

export namespace PlaceOrderUseCase {
  export type ProductId = string;
  export type CurrentStock = number;

  export type Product = {
    id: string;
    name: string;
    currentStock: number;
    price: string;
  };

  export type Input = {
    accountId: string;
    storeId: string;
    saleOrder: {
      productId: string;
      quantity: number;
    }[];
    methodPayment: MethodPayment;
  };

  export type Output = {
    orderId: string;
    total: number;
    items: number;
    status: Order.Status;
    paymentStatus: Order.PaymentStatus;
  };
}
