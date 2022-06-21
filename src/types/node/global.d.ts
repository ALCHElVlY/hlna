namespace NodeJS {
  interface ProcessEnv {
    // Server variables
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    BASE_URL: string;
    MONGO_URI: string;
    API_KEY: string;
    // Client variables
    BOT_TOKEN: string;
    APPLICATION_ID: string;
    BOT_DEV: string | string[];
    GITHUB_REPO: string;
    DEV_DISCORD: string;
    BM_API_STANDARD: string;
    BM_API_GENESIS: string;
    BATTLEMETRICS: string;
    WELCOME_IMAGE: string;
    ARK_ICON: string;
    WYVERN_MILK: string;
    GASOLINE: string;
    TEK_GEN: string;
    ELEMENT: string;
    ELEMENT_SHARD: string;
    CLONING_CHAMBER: string;
    ROLE_ADDED: string;
    ROLE_REMOVED: string;
  }
}