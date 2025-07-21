import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './applicationError';

export class ProductAlreadyInUse extends ApplicationError {
  public override statusCode? = 409;

  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'ProductAlreadyInUse';
    this.message = 'This Product name is already in use';
    this.code = ErrorCode.PRODUCT_NAME_ALREADY_IN_USE;
  }

}
