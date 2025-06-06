import { Controller } from '@application/contracts/Controller';
import { RegisterStoreUseCase } from '@application/usecases/store/RegisterStoreUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { RegisterStoreBody, registerStoreSchema } from './schemas/RegisterStoreSchema';

@Injectable()
@Schema(registerStoreSchema)
export class RegisterStoreController extends Controller<Controller.Response> {
  constructor(private readonly registerStoreUseCase: RegisterStoreUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<RegisterStoreBody>) {
    const { store } = body;

    await this.registerStoreUseCase.execute(store);

    return {
      statusCode: 201,
    };
  }

}
