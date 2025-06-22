import { Controller } from '@application/contracts/Controller';

import { Schema } from '@kernel/decorators/Schema';

import { ForgotPasswordUseCase } from '@application/usecases/auth/ForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { ForgotPassowrdBody, forgotPassowrdSchema } from './schemas/forgotPassowrdSchema';

@Injectable()
@Schema(forgotPassowrdSchema)
export class ForgotPasswordController extends Controller<'public', ForgotPasswordController.Response> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', ForgotPassowrdBody>): Promise<Controller.Response<ForgotPasswordController.Response>> {
    try {
      const { email } = body;

      await this.forgotPasswordUseCase.execute({ email });
    } catch {
      //
    }

    return {
      statusCode: 204,
    };
  }

}

export namespace ForgotPasswordController {
  export type Response = null;
}
