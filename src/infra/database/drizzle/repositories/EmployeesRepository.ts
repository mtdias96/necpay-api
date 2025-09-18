import { Employees } from '@application/entities/Employees';
import { Injectable } from '@kernel/decorators/Injectable';
import { storeEmployees } from '../schema/stores';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class EmployeesRepository {
  async create(
    employees: Employees,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const transaction = trx;
    await transaction.insert(storeEmployees).values(employees);
  }
}
