namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_ISSUER: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    DATABASE_URL: string;
    AWS_KEY: string;
    AWS_SECRET: string;
    AWS_LOCATION: string;
    AWS_S3_BUCKET: string;
    AWS_S3_DOMAIN: string;
  }
}
