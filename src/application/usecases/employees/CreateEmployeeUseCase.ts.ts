import { Account } from '@application/entities/Account';
import { Employees, ERole } from '@application/entities/Employees';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { AccountRepository } from '@infra/database/drizzle/repositories/AccountRepository';
import { CreateEmployeesUnitOfWork } from '@infra/database/drizzle/uow/CreateEmployeesUnitOfWork';

import { Injectable } from '@kernel/decorators/Injectable';
import { Saga } from '@shared/saga/Saga';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly createEmployeesUnitOfWork: CreateEmployeesUnitOfWork,
    private readonly saga: Saga,

  ) { }

  async execute(
    {
      account: {
        email,
        name,
        role,
        password,
      },
      storeId,
    }: CreateEmployeeUseCase.Input): Promise<CreateEmployeeUseCase.Output> {
    return this.saga.run(async () => {
      const emailAlreadyExists = await this.accountRepository.findByEmail(email);

      if (emailAlreadyExists) {
        throw new EmailAlreadyInUse();
      }

      const accounts = new Account({
        email,
        name,
      });

       const accountEmployees = new Employees({
        accountId: accounts.id,
        storeId,
        role,
      });

      const { externalId } = await this.authGateway.signUp({
        email,
        password,
        storeId,
        internalId: accounts.id,
      });

      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));

      accounts.externalId = externalId;

      await this.createEmployeesUnitOfWork.run({
        account: accounts,
        employees: accountEmployees,
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

export namespace CreateEmployeeUseCase {
  export type Input = {
    account: {
      name: string;
      email: string;
      password: string;
      role: ERole;
    }

    storeId: string;
  }

  export type Output = {
   accessToken: string;
   refreshToken: string;
  };
}
