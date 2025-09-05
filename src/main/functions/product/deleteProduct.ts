import 'reflect-metadata';

import { DeleteProductController } from '@application/controllers/product/DeleteProductController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(DeleteProductController);
export const handler = lambdaHttpAdapter(controller);
