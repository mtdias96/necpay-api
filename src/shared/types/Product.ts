import { Product } from '@application/entities/Product';

export type ProductResponseType = {
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
