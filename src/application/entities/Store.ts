import { randomUUID } from 'node:crypto';

export class Store {
  readonly id: string;
  readonly nameStore: string;
  readonly emailStore: string | undefined;
  readonly phoneStore: string | undefined;
  readonly accountId: string;
  readonly createdAt: Date;

  constructor(attrs: Store.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.emailStore = attrs.emailStore;
    this.nameStore = attrs.nameStore;
    this.accountId = attrs.accountId;
    this.phoneStore = attrs.phoneStore;
    this.createdAt = attrs.createdAt ?? new Date();
  }
}
export namespace Store {
  export type Attributes = {
    id?: string
    emailStore?: string;
    nameStore: string;
    phoneStore?: string;
    accountId: string;
    createdAt?: Date;
  }
}

