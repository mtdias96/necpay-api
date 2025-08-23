import 'reflect-metadata';

import { GetSaleByPeriodController } from '@application/controllers/reports/sale/GetByPeriodController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetSaleByPeriodController);

export const handler = lambdaHttpAdapter(controller);
