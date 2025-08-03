import { randomUUID } from 'crypto';

export class OrderItem {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;

  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;

  constructor(attrs: OrderItem.Attributes) {
    this.id = attrs.id ?? randomUUID();
    this.orderId = attrs.orderId;
    this.productId = attrs.productId;
    this.productName = attrs.productName;
    this.unitPrice = attrs.unitPrice;
    this.quantity = attrs.quantity;
    this.subtotal = this.unitPrice * this.quantity;
    this.createdAt = attrs.createdAt ?? new Date();
    this.updatedAt = attrs.updatedAt;
  }
}

export namespace OrderItem {
  export type Attributes = {
    id?: string;
    orderId: string;
    productId: string;

    productName: string;
    unitPrice: number;
    quantity: number;

    createdAt?: Date;
    updatedAt?: Date;
  };
}
