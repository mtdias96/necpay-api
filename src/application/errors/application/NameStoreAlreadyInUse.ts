import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './applicationError';

export class NameStoreAlreadyInUse extends ApplicationError {
  public override statusCode? = 409;

  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'NameAlreadyInUse';
    this.message = 'This name is already in use';
    this.code = ErrorCode.NAME_ALREADY_IN_USE;
  }

}
