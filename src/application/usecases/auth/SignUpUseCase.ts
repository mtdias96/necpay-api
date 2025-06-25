import { Account } from '@application/entities/Account';
import { Store } from '@application/entities/Store';
import { SignUpUnitOfWork } from '@infra/database/drizzle/uow/SignUpUnitOfWork';

import { Injectable } from '@kernel/decorators/Injectable';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly signnUpUnitOfWork: SignUpUnitOfWork,

  ) { }

  async execute({ account, store }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const { email, name, password } = account;
    const { emailStore, nameStore, phoneStore } = store;

    const accounts = new Account({ email, name });
    const storeCreate = new Store({ emailStore, nameStore, phoneStore, accountId: accounts.id });

    const { externalId } = await this.authGateway.signUp({
      email,
      password,
      storeId: storeCreate.id,
    });

    accounts.externalId = externalId;

    await this.signnUpUnitOfWork.run({
      account: accounts,
      store: storeCreate,
    });

    const {
      accessToken,
      refreshToken,
    } = await this.authGateway.signIn({ email, password });

    return {
      accessToken,
      refreshToken,
    };
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
      nameStore: string;
      emailStore?: string;
      phoneStore?: string;
    }
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }

}
