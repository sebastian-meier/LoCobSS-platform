export {}

declare global {
  const __global: {
    env: {
      isProd: boolean;
      FIREBASE_CONFIG_API_KEY: string;
      FIREBASE_CONFIG_AUTH_DOMAIN: string;
      FIREBASE_CONFIG_PROJECT_ID: string;
      FIREBASE_CONFIG_STORAGE_BUCKET: string;
      FIREBASE_CONFIG_MESSAGING_SENDER_ID: string;
      FIREBASE_CONFIG_APP_ID: string;
      FIREBASE_CONFIG_MEASUREMENT_ID: string;
    }
  };
}