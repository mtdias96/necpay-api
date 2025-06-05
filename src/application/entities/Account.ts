export class Account {
  readonly email: string;
  readonly name: string;

  externalId: string;

  constructor(attrs: Account.Attributes) {
    this.email = attrs.email;
    this.name = attrs.name;
    this.externalId = attrs.externalId;
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    name: string
    externalId: string
  }
}
