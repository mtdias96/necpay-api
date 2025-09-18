import { Account } from '@application/entities/Account';
import { Employees } from '@application/entities/Employees';
import { Store } from '@application/entities/Store';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from '../repositories/AccountRepository';
import { EmployeesRepository } from '../repositories/EmployeesRepository';
import { StoreRepository } from '../repositories/StoreRepository';

@Injectable()
export class SignUpUnitOfWork {
  constructor(
    private readonly drizzleClient: DrizzleClient,
    private readonly accountRepository: AccountRepository,
    private readonly storeRepository: StoreRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) { }

  async run({ account, store, employee }: { account: Account; store: Store,  employee : Employees }): Promise<void> {
    await this.drizzleClient.wsClient.transaction(async (tx) => {
      await this.accountRepository.create(account, tx);
      await this.storeRepository.create(store, tx);
      await this.employeesRepository.create(employee, tx);
    });
  }
}

