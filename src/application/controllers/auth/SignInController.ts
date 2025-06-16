import { Controller } from '@application/contracts/Controller';
import { SignInUseCase } from '@application/usecases/auth/SignInUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { SignInBody, signInSchema } from './schemas/signInSchema';

@Injectable()
@Schema(signInSchema)
export class SignInControlle extends Controller<'public', SignInController.Response> {
  constructor(private readonly sigInUseCase: SignInUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', SignInBody>): Promise<Controller.Response<SignInController.Response>> {
    const account = body;

    const {
      accessToken,
      refreshToken,
    } = await this.sigInUseCase.execute(account);

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }

}

export namespace SignInController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  }
}
