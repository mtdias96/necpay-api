import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './applicationError';

export class InsufficientStock extends ApplicationError {
  public override statusCode = 400;

  public override code: ErrorCode;

  constructor(productName: string, currentStock: number, requested: number) {
    super();

    this.name = 'InsufficientStock';
    this.message = `Estoque insuficiente para o produto "${productName}". Atual: ${currentStock}, Solicitado: ${requested}`;
    this.code = ErrorCode.INSUFFICIENT_STOCK;
  }
}
