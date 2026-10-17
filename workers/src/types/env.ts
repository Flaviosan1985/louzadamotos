export interface Env {
  DB: D1Database;
  PHOTOS_BUCKET: R2Bucket;
  JWT_SECRET: string;
  JWT_ISSUER: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ACCOUNT_ID: string;
  R2_BUCKET_NAME: string;
}

export type AuthUser = {
  userId: string;
  email: string;
  role: string;
};
