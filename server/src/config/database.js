const { Sequelize } = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USERNAME, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.DB_DIALECT,
  port: config.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: false,
      useUTC: false,
    },
  },
  timezone: '-05:00',
  charset: 'utf8',
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connect };