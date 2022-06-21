// External imports
import dotenv from 'dotenv';

// Parse the env file
dotenv.config();

/**
 * Interface to load all of the enviroment variables
 */
interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  BASE_URL: string | undefined;
  API_KEY: string | undefined;
  CONFIGURATION: string | undefined;
  DOSSIER: string | undefined;
  ITEMS: string | undefined;
  BOT_TOKEN: string;
  DEV_BOT_TOKEN: string | undefined;
  APPLICATION_ID: string;
  DEV_APPLICATION_ID: string | undefined;
  BOT_DEV: string | string[];
  GITHUB_REPO: string;
  DEV_DISCORD: string;
  BATTLEMETRICS: string;
  BM_API_STANDARD: string;
  BM_API_GENESIS: string;
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

/**
 * Interface for loading env variables that the client needs
 */
interface ClientConfig {
  BOT_TOKEN: string;
  DEV_BOT_TOKEN: string;
  APPLICATION_ID: string;
  DEV_APPLICATION_ID: string;
  BOT_DEV: string | string[];
  BASE_URL: string;
  CONFIGURATION: string;
  DOSSIER: string;
  ITEMS: string;
  API_KEY: string;
  GITHUB_REPO: string;
  DEV_DISCORD: string;
  BATTLEMETRICS: string;
  BM_API_STANDARD: string;
  BM_API_GENESIS: string;
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

/**
 * Interface for loading env variables that the server needs
 */
interface ServerConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  API_KEY: string;
}

/**
 * Load all process.env variables as ENV variables
 */
const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    BASE_URL: process.env.BASE_URL,
    CONFIGURATION: process.env.CONFIGURATION,
    DOSSIER: process.env.DOSSIER,
    ITEMS: process.env.ITEMS,
    MONGO_URI: process.env.MONGO_URI,
    API_KEY: process.env.API_KEY,
    BOT_TOKEN: process.env.BOT_TOKEN,
    DEV_BOT_TOKEN: process.env.DEV_BOT_TOKEN,
    APPLICATION_ID: process.env.APPLICATION_ID,
    DEV_APPLICATION_ID: process.env.DEV_APPLICATION_ID,
    BOT_DEV: process.env.BOT_DEV,
    GITHUB_REPO: process.env.GITHUB_REPO,
    DEV_DISCORD: process.env.DEV_DISCORD,
    BATTLEMETRICS: process.env.BATTLEMETRICS,
    BM_API_STANDARD: process.env.BM_API_STANDARD,
    BM_API_GENESIS: process.env.BM_API_GENESIS,
    WELCOME_IMAGE: process.env.WELCOME_IMAGE,
    ARK_ICON: process.env.ARK_ICON,
    WYVERN_MILK: process.env.WYVERN_MILK,
    GASOLINE: process.env.GASOLINE,
    TEK_GEN: process.env.TEK_GEN,
    ELEMENT: process.env.ELEMENT,
    ELEMENT_SHARD: process.env.ELEMENT_SHARD,
    CLONING_CHAMBER: process.env.CLONING_CHAMBER,
    ROLE_ADDED: process.env.ROLE_ADDED,
    ROLE_REMOVED: process.env.ROLE_REMOVED,
  };
};

// Throwing an error if any field was undefined, we don't
// want the app to run if it can't connect to the DB and ensure
// that these fields are accessible. If all is good, return
// it as ServerConfig which just removes the undefined from our type
// definition.
const getServerConfig = (config: ENV): ServerConfig => {
  const keysToGet = ['NODE_ENV', 'PORT', 'MONGO_URI', 'API_KEY'];
  for (const [key, value] of Object.entries(config)) {
    /* if (value === undefined) {
      throw new Error(`${key} is undefined`);
    }*/
    if (!keysToGet.includes(key)) continue;
  }
  return config as ServerConfig;
};

const getClientConfig = (config: ENV): ClientConfig => {
  const keysToSkip = ['NODE_ENV', 'PORT', 'MONGO_URI'];
  for (const [key, value] of Object.entries(config)) {
    if (keysToSkip.includes(key)) continue;
  }
  return config as ClientConfig;
};

const config = getConfig();
export const serverConfig = getServerConfig(config);
export const clientConfig = getClientConfig(config);
