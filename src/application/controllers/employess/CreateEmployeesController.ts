import { Controller } from '@application/contracts/Controller';

import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { CreateEmployeeUseCase } from '@application/usecases/employees/CreateEmployeeUseCase.ts';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { CreateEmployeesBody, createEmployessSchema } from './schema/createEmployessSchema';

@Injectable()
@Schema(createEmployessSchema)
export class CreateEmployeesController extends Controller<'public', CreateEmployeesController.Response> {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {
    super();
  }
  protected override async handle({ body, storeId }: Controller.Request<'public', CreateEmployeesBody>): Promise<Controller.Response<CreateEmployeesController.Response>> {
    const { account } = body;

    if(!storeId){
      return new ResourceNotFound();
    }

    const {
      accessToken,
      refreshToken,
    } = await this.createEmployeeUseCase.execute({ account, storeId });

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace CreateEmployeesController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  }
}
