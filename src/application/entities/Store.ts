
export class Store {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly accountId: string;

  constructor(attrs: Store.Attributes) {
    this.email = attrs.email;
    this.name = attrs.name;
    this.accountId = attrs.accountId;
    this.phone = attrs.phone;
  }
}
export namespace Store {
  export type Attributes = {
    email: string;
    name: string;
    phone: string;
    accountId: string;
  }
}

