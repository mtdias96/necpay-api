import { randomUUID } from 'node:crypto';

export class Account {
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  id: string;
  externalId: string;

  constructor(attrs: Account.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.email = attrs.email;
    this.name = attrs.name;
    this.externalId = attrs.externalId ?? '';
    this.createdAt = attrs.createdAt ?? new Date();
  }
}
export namespace Account {
  export type Attributes = {
    id?: string
    email: string;
    name: string;
    externalId?: string;
    createdAt?: Date;
  };

}
