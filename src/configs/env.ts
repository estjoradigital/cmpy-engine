import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  APP_NAME: get('APP_NAME').default('App').asString(),
  APP_DESC: get('APP_DESC').default('API backend service').asString(),
  APP_ENV: get('APP_ENV').default('dev').asString(),
  PORT: get('PORT').default(3000).asPortNumber(),

  // Remove .required() - let it be optional during import
  DATABASE_URL: get('DATABASE_URL').asString(),
  JWT_SECRET: get('JWT_SECRET').asString(),
  JWT_EXPIRY: get('JWT_EXPIRY').default('15m').asString(),
  REDIS_URL: get('REDIS_URL').default('redis://localhost:6379').asString(),
  MAIL_LABEL: get('MAIL_LABEL').default('App Backend').asString(),
  MAIL_FROM: get('MAIL_FROM').asString(),
  SMTP_URL: get('SMTP_URL').asString(),
};
