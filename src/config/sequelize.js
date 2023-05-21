const { Sequelize } = require('sequelize');

const {
  NODE_ENV,
  DB_HOST_DEV,
  DB_HOST_PROD,
  DB_NAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD_DEV,
  DB_PASSWORD_PROD,
} = process.env;

const sequelize = new Sequelize(
  DB_NAME,
  DB_USERNAME,
  NODE_ENV === 'production' ? DB_PASSWORD_PROD : DB_PASSWORD_DEV,
  {
    dialect: 'postgres',
    host: NODE_ENV === 'production' ? DB_HOST_PROD : DB_HOST_DEV,
    port: DB_PORT,
  }
);

module.exports = sequelize;
