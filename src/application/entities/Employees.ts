
export enum ERole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  READONLY = 'READONLY',
}

export class Employees {
  readonly createdAt: Date;
  readonly storeId: string;
  readonly accountId: string;
  externalId: string;
  role: ERole;

  constructor(attrs: Employees.Attributes) {
    this.accountId = attrs.accountId;
    this.externalId = attrs.externalId ?? '';
    this.storeId = attrs.storeId;
    this.role = attrs.role;
    this.createdAt = attrs.createdAt ?? new Date();
  }
}
export namespace Employees {
  export type Attributes = {
    accountId: string
    externalId?: string;
    storeId: string;
    role: ERole;
    createdAt?: Date;
  };

}
