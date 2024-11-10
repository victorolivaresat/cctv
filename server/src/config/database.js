require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

function init() {
  sequelize.sync({
    alter: true
  }).then(() => {
    console.log("All models were synchronized successfully.");
  }).catch((error) => { console.log(error) });
}

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

function close() {
  sequelize.close();
}

exports.init = init;
exports.connect = connect;
exports.close = close;
module.exports = sequelize;
