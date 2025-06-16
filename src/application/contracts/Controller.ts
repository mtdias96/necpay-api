import { getSchema } from '@kernel/decorators/Schema';

type TRouteType = 'public' | 'private'
export abstract class Controller<TType extends TRouteType, Tbody = undefined> {
  protected abstract handle(request: Controller.Request<TType>): Promise<Controller.Response<Tbody>>;

  public execute(request: Controller.Request<TType>): Promise<Controller.Response<Tbody>> {
    const body = this.validateBody(request.body);

    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request<TType>['body']) {
    const schema = getSchema(this);
    if (!schema) {
      return body;
    }

    return schema.parse(body);
  }
}

export namespace Controller {
  type BaseRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
  };

  type PublicRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, TParams, TQueryParams> & {
    storeId: null
  }

  type PrivateRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, TParams, TQueryParams> & {
    storeId: string
  }

  export type Request<
    TType extends TRouteType,
    Tbody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>
  > = TType extends 'public'
    ? PublicRequest<Tbody, TParams, TQueryParams>
    : PrivateRequest<Tbody, TParams, TQueryParams>

  export type Response<Tbody = undefined> = {
    statusCode: number;
    body?: Tbody
  };
}
