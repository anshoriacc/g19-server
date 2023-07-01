require('dotenv').config();

const {
  DB_HOST_DEV,
  DB_HOST_PROD,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD_DEV,
  DB_PASSWORD_PROD,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD_DEV,
    database: DB_NAME,
    host: DB_HOST_DEV,
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD_PROD,
    database: DB_NAME,
    host: DB_HOST_PROD,
    dialect: 'postgres',
  },
};
