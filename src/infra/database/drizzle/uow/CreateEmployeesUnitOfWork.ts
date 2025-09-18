import { Account } from '@application/entities/Account';
import { Employees } from '@application/entities/Employees';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from '../repositories/AccountRepository';
import { EmployeesRepository } from '../repositories/EmployeesRepository';

@Injectable()
export class CreateEmployeesUnitOfWork {
  constructor(
    private readonly drizzleClient: DrizzleClient,
    private readonly accountRepository: AccountRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) { }

  async run({ account, employees }: { account: Account; employees: Employees }): Promise<void> {
    await this.drizzleClient.wsClient.transaction(async (tx) => {
      await this.accountRepository.create(account, tx);
      await this.employeesRepository.create(employees, tx);
    });
  }
}
