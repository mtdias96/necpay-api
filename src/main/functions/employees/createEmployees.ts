import 'reflect-metadata';

import { CreateEmployeesController } from '@application/controllers/employess/CreateEmployeesController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateEmployeesController);
export const handler = lambdaHttpAdapter(controller);
