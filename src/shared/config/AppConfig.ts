import { Injectable } from '@kernel/decorators/Injectable';
import { env } from './env';

@Injectable()
export class AppConfig {
  readonly database: AppConfig.Database;
  readonly auth: AppConfig.Auth;
  readonly storage: AppConfig.Storage;

  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        poolId: env.COGNITO_POOL_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
      },
    };

    this.storage = {
      productsBucket: env.PRODUCTS_BUCKET,
      categoryBucket: env.CATEGORY_BUCKET,
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

  export type Storage = {
    productsBucket: string;
    categoryBucket: string;
  }
}
