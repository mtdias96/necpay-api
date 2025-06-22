import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './applicationError';

export class InvalidRefreshToken extends ApplicationError {
  public override statusCode? = 401;

  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'InvalidRefreshToken';
    this.message = 'Evalid Refresh Token';
    this.code = ErrorCode.INVALID_REFRESH_TOKEN;
  }

}
