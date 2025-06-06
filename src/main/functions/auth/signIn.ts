import 'reflect-metadata';

import { SignInControlle } from '@application/controllers/auth/SignInController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(SignInControlle);

export const handler = lambdaHttpAdapter(controller);
