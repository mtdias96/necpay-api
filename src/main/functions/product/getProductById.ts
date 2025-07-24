import 'reflect-metadata';

import { GetProductByIdController } from '@application/controllers/product/GetProductByIdController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetProductByIdController);
export const handler = lambdaHttpAdapter(controller);
