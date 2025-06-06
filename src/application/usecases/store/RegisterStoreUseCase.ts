import { Store } from '@application/entities/Store';
import { StoreRepository } from '@infra/database/drizzle/repositories/store/StoreRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class RegisterStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) { }

  async execute({
    accountId,
    email,
    nameStore,
    phone,
  }: RegisterStoreUseCase.Input) {
    const storeInfo = new Store({ email, accountId, nameStore, phone });
    await this.storeRepo.create(storeInfo);
  }
}

export namespace RegisterStoreUseCase {
  export type Input = {
    email: string;
    nameStore: string;
    phone: string;
    accountId: string;
  }
}
