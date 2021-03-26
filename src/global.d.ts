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
      SITE_URL: string;
      RECAPTCHA_v2: string;
      RECAPTCHA_v3: string;
    }
  };
  interface Window {
    grecaptcha: {
      getResponse: () => {
        [key: string]: string
      },
      reset: () => void
    },
    verifyUser: (e: string) => void;
  };
  interface Taxonomy {
    id: number;
    parent: number;
    name: string;
  };
  interface publicQuestion {
    id: number; 
    question_de: string;
    description_de: string;
    participantSynonym: string; 
    created: string;
    tsne_x: number;
    tsne_y: number;
    has_reply: boolean;
    taxonomies: {
      id: number;
      name: string;
    }[];
    replies: {
      id: number;
      name: string;
    }[];
  };
  interface publicQuestionResult {
    maxPage: number;
    count: number;
    dateRange: [string, string];
    page: number;
    hasSearch: boolean;
    hasTaxonomy: boolean;
    hasDate: boolean;
    hasAnswer: boolean;
    results: publicQuestion[];
  };
}
