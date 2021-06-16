require('dotenv').config();
const PORT = process.env.PORT || 3000;

type appType = {
  appName: string,
  environment: string,
  apiHost: string,
  port: string | number,
  mongodb: Record<'test', string | undefined>
}
const app: Omit<appType, 'mongodb'> = {
    appName: process.env.APP_NAME || 'Team Manager',
    environment: process.env.NODE_ENV || 'development',
    apiHost: `http://localhost:${PORT}`,
    port: PORT,
};

const databases: Pick<appType, 'mongodb'> = {
  mongodb: {
    test: process.env.DB_TEST_URL
  }
};

 module.exports = {
   app,
   databases
 };
