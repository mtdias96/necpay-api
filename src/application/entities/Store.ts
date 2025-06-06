export class Store {
  readonly nameStore: string;
  readonly email: string;
  readonly phone: string;
  readonly accountId: string;

  constructor(attrs: Store.Attributes) {
    this.email = attrs.email;
    this.nameStore = attrs.nameStore;
    this.accountId = attrs.accountId;
    this.phone = attrs.phone;
  }
}

export namespace Store {
  export type Attributes = {
    email: string;
    nameStore: string;
    phone: string;
    accountId: string;
  }
}

