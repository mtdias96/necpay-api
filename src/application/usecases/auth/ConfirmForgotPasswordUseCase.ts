import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) { }

  async execute({
    code,
    email,
    password,
  }: ConfirmForgotPasswordUseCase.Input): Promise<ConfirmForgotPasswordUseCase.Output> {
    await this.authGateway.confirmForgotPassword({
      code,
      email,
      password,
    });
  }
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    code: string;
    email: string;
    password: string;
  }

  export type Output = void;

}
