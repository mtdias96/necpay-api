import 'reflect-metadata';

import { RegisterStoreController } from '@application/controllers/store/RegisterStoreController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(RegisterStoreController);

export const handler = lambdaHttpAdapter(controller);
