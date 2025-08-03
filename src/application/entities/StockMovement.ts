import { randomUUID } from 'crypto';

export class StockMovement {
  readonly id: string;
  readonly storeId: string;
  readonly productId: string;
  readonly type: StockMovement.Type;
  readonly quantity: number;
  readonly costPrice?: number;
  readonly movementDate: Date;
  readonly createdAt: Date;

  constructor(attrs: StockMovement.Attributes) {
    this.id = attrs.id ?? randomUUID();
    this.storeId = attrs.storeId;
    this.productId = attrs.productId;
    this.type = attrs.type;
    this.quantity = attrs.quantity;
    this.costPrice = attrs.costPrice;
    this.movementDate = attrs.movementDate ?? new Date();
    this.createdAt = attrs.createdAt ?? new Date();
  }
}

export namespace StockMovement {
  export type Attributes = {
    id?: string;
    storeId: string;
    productId: string;
    type: Type;
    quantity: number;
    costPrice?: number;
    movementDate?: Date;
    createdAt?: Date;
  };

  export enum Type {
    ENTRY = 'ENTRY',
    EXIT = 'EXIT',
  }
}
