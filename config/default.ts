require('dotenv').config();
const PORT = process.env.PORT || 3000;

type appType = {
  appName: string;
  environment: string;
  apiHost: string;
  port: string | number;
  mongodb: Record<'test', string | undefined>;
};

type apiType = {
  url: string;
  lang: string;
  prefix: string;
  versions: Array<number>;
  pagination: Record<'itemsPerPage', number>;
};
const app: Omit<appType, 'mongodb'> = {
  appName: process.env.APP_NAME || 'Team Manager',
  environment: process.env.NODE_ENV || 'development',
  apiHost: `http://localhost:${PORT}`,
  port: PORT,
};

const databases: Pick<appType, 'mongodb'> = {
  mongodb: {
    test: process.env.DB_TEST_URL,
  },
};

const api: apiType = {
  url: process.env.SERVICE_URL || 'http://127.0.0.1:8000/api/v1',
  lang: 'en',
  prefix: '^/v[1-9]',
  versions: [1],
  pagination: {
    itemsPerPage: 10,
  },
};

module.exports = {
  app,
  databases,
  api,
};
