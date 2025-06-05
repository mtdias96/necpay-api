import { Injectable } from '@kernel/decorators/Injectable';
import { neon } from '@neondatabase/serverless';
import { AppConfig } from '@shared/config/AppConfig';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

@Injectable()
export class DrizzleService {
  private readonly db: NeonHttpDatabase;

  constructor(private readonly appConfig: AppConfig) {

    const sql = neon(this.appConfig.database.neon.baseURL);
    this.db = drizzle({ client: sql });
  }

  get client() {
    return this.db;
  }
}
