import { Account } from '@application/entities/Account';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { AccountRepository } from '@infra/database/drizzle/repositories/AccountRepository';

import { Injectable } from '@kernel/decorators/Injectable';
import { Saga } from '@shared/saga/Saga';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly saga: Saga,

  ) { }

  async execute(
    {
      account: {
        email,
        name,
        password,
      },
      storeId,
    }: CreateEmployeeUseCase.Input): Promise<CreateEmployeeUseCase.Output> {
    return this.saga.run(async () => {
      const emailAlreadyExists = await this.accountRepository.findByEmail(email);

      if (emailAlreadyExists) {
        throw new EmailAlreadyInUse();
      }

      const account = new Account({ email, name });

      const { externalId } = await this.authGateway.signUp({
        email,
        password,
        storeId,
        internalId: account.id,
      });

      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));

      account.externalId = externalId;

      return {
        id: account.id,
        externalId: account.externalId!,
        email: account.email,
        name: account.name,
      };
    });

  }
}

export namespace CreateEmployeeUseCase {
  export type Input = {
    account: {
      name: string;
      email: string;
      password: string;
    }

    storeId: string;
  }

  export type Output = {
    id: string;
    externalId: string;
    name: string;
    email: string;
  };
}
