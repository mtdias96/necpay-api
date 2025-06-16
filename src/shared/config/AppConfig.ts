import { Injectable } from '@kernel/decorators/Injectable';
import { env } from './env';

@Injectable()
export class AppConfig {
  readonly database: AppConfig.Database;
  readonly auth: AppConfig.Auth;

  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        poolId: env.COGNITO_POOL_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
      },
    };
    this.database = {
      neon: {
        baseURL: env.DATABASE_URL,
      },
    };
  }
}

export namespace AppConfig {
  export type Database = {
    neon: {
      baseURL: string
    }
  }

  export type Auth = {
    cognito: {
      poolId: string
      clientId: string
      clientSecret: string
    }
  }
}
