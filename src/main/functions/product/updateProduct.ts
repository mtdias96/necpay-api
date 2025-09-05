import 'reflect-metadata';

import { UpdateProductController } from '@application/controllers/product/UpdateProductController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(UpdateProductController);

export const handler = lambdaHttpAdapter(controller);
