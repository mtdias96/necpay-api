import { Controller } from '@application/contracts/Controller';

import { HelloUseCase } from '@application/usecases/HelloUseCase';
import { Schema } from '@kernel/decorators/Schema';
import { HelloBody, helloSchema } from './schemas/helloSchema';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super();
  }
  protected override async handle(request: Controller.Request<HelloBody>): Promise<Controller.Response<unknown>> {
    const result = await this.helloUseCase.execute({
      email: request.body.email,
    });
    return {
      statusCode: 200,
      body: {
        parsedBody: result,
      },
    };
  }
}
