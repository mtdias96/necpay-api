import { randomUUID } from 'node:crypto';

export class Category {
  readonly name: string;
  readonly createdAt: Date;

  id: string;
  storeId: string;
  iconPath: string | null;
  active: boolean;

  constructor(attrs: Category.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.storeId = attrs.storeId;
    this.name = attrs.name;
    this.iconPath = attrs.iconPath ;
    this.active = attrs.active ?? true;
    this.createdAt = attrs.createdAt ?? new Date();
  }
}
export namespace Category {
  export type Attributes = {
    id?: string
    storeId: string;
    name: string;
    iconPath: string | null
    active?: boolean
    createdAt?: Date;
  }
}
