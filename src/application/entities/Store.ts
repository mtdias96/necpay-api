import { randomUUID } from 'node:crypto';

export class Store {
  readonly name: string;
  readonly createdAt: Date;

  email: string | null;
  phone: string | null;
  id: string;
  accountId: string;

  constructor(attrs: Store.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;
    this.email = attrs.email || null;
    this.name = attrs.name;
    this.phone = attrs.phone || null;
    this.createdAt = attrs.createdAt ?? new Date();
  }
}
export namespace Store {
  export type Attributes = {
    id?: string
    email?: string;
    name: string;
    phone?: string;
    accountId: string;
    createdAt?: Date;
  }
}

