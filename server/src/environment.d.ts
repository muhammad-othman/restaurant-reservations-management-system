declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_SECRET: string;
      MONGODB_URI: string;
      CLIENT_URL: string;
    }
  }
}

export {}