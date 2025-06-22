import { Controller } from '@application/contracts/Controller';

import { Schema } from '@kernel/decorators/Schema';

import { BadRequest } from '@application/errors/http/BadRequest';
import { ConfirmForgotPasswordUseCase } from '@application/usecases/auth/ConfirmForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { ConfirmForgotPasswordBody, confirmForgotPasswordSchema } from './schemas/ConfirmForgotPasswordSchema';

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public', ConfirmForgotPasswordController.Response> {
  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', ConfirmForgotPasswordBody>): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {
    try {
      const {
        code,
        email,
        password,
      } = body;

      await this.confirmForgotPasswordUseCase.execute({
        code,
        email,
        password,
      });

      return {
        statusCode: 204,
      };
    } catch {
      throw new BadRequest('Failed. Try again.');
    }
  }

}

export namespace ConfirmForgotPasswordController {
  export type Response = null;
}
