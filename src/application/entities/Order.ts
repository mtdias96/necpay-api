import { randomUUID } from 'crypto';

export class Order {
  readonly id: string;
  readonly storeId: string;
  readonly operatorId: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;

  total: number;
  totalItems: number;
  methodPayment: Order.MethodPayment;
  status: Order.Status;
  paymentStatus: Order.PaymentStatus;

  constructor(attrs: Order.Attributes) {
    this.id = attrs.id ?? randomUUID();
    this.storeId = attrs.storeId;
    this.operatorId = attrs.operatorId;

    this.total = attrs.total;
    this.totalItems = attrs.totalItems;

    this.methodPayment = attrs.methodPayment;
    this.status = attrs.status ?? Order.Status.COMPLETED;
    this.paymentStatus = attrs.paymentStatus ?? Order.PaymentStatus.PAID;

    this.createdAt = attrs.createdAt ?? new Date();
    this.updatedAt = attrs.updatedAt;
  }
}

export namespace Order {
  export type Attributes = {
    id?: string;
    storeId: string;
    operatorId: string;
    total: number;
    totalItems: number;
    methodPayment: Order.MethodPayment;
    status?: Order.Status;
    paymentStatus?: Order.PaymentStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export enum MethodPayment {
    CASH = 'cash',
    PIX = 'pix',
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
  }

  export enum Status {
    COMPLETED = 'completed',
    CANCELED = 'canceled',
    PENDING = 'pending'
  }

  export enum PaymentStatus {
    PAID = 'paid',
    REFUSED = 'refused',
    PENDING = 'pending'
  }
}
