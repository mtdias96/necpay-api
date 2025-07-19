import { randomUUID } from 'node:crypto';

export class Product {
  readonly id: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly storeId: string;

  readonly categoryId: string;

  readonly inputType: Product.InputType;

  readonly inputFileKey: string;

  status: Product.Status;

  name: string;

  price: number;

  costPrice: number;

  currentStock: number;

  stockAlert: number;

  barcode?: string;

  description?: string;

  constructor(attr: Product.Attributes) {
    this.id = attr.id ?? randomUUID();
    this.storeId = attr.storeId;
    this.categoryId = attr.categoryId;
    this.inputType = attr.inputType;
    this.inputFileKey = attr.inputFileKey;
    this.status = attr.status;
    this.name = attr.name ?? '';
    this.price = attr.price ?? 0;
    this.costPrice = attr.costPrice ?? 0;
    this.currentStock = attr.currentStock ?? 0;
    this.stockAlert = attr.stockAlert ?? 0;
    this.description = attr.description ?? '';
    this.barcode = attr.barcode ?? `${randomUUID()}`;

    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }
}

export namespace Product {
  export type Attributes = {
    id?: string;
    storeId: string;
    categoryId: string;
    status: Product.Status;
    inputType: Product.InputType;
    name?: string;
    price?: number;
    costPrice?: number;
    currentStock?: number;
    stockAlert?: number;
    inputFileKey: string;
    barcode?: string | undefined;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }

  export enum InputType {
    PICTURE = 'PICTURE',
  }
}
