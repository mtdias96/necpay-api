import { Account } from '@application/entities/Account';
import { Store } from '@application/entities/Store';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { NameStoreAlreadyInUse } from '@application/errors/application/NameStoreAlreadyInUse';
import { AccountRepository } from '@infra/database/drizzle/repositories/AccountRepository';
import { StoreRepository } from '@infra/database/drizzle/repositories/StoreRepository';
import { SignUpUnitOfWork } from '@infra/database/drizzle/uow/SignUpUnitOfWork';

import { Injectable } from '@kernel/decorators/Injectable';
import { Saga } from '@shared/saga/Saga';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly storeRepository: StoreRepository,
    private readonly signnUpUnitOfWork: SignUpUnitOfWork,
    private readonly saga: Saga,

  ) { }

  async execute(
    {
      account: {
        email,
        name,
        password,
      },
      store: storeInfo,
    }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    return this.saga.run(async () => {
      const emailAlreadyExists = await this.accountRepository.findByEmail(email);
      const storeNameAlreadyExists = await this.storeRepository.findByName(storeInfo.name);

      if (emailAlreadyExists) {
        throw new EmailAlreadyInUse();
      }

      if (storeNameAlreadyExists) {
        throw new NameStoreAlreadyInUse();
      }

      const account = new Account({ email, name });
      const store = new Store({
        ...storeInfo,
        accountId: account.id,
      });

      const { externalId } = await this.authGateway.signUp({
        email,
        password,
        storeId: store.id,
        internalId: account.id,
      });

      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));

      account.externalId = externalId;

      await this.signnUpUnitOfWork.run({
        account: account,
        store: store,
      });

      const {
        accessToken,
        refreshToken,
      } = await this.authGateway.signIn({ email, password });

      return {
        accessToken,
        refreshToken,
      };
    });

  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      name: string;
      email: string;
      password: string;
    }

    store: {
      name: string;
      email?: string;
      phone?: string;
    }
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }

}
