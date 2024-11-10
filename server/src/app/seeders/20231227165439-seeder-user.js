"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "PREVENCIÓN",
        lastName: "DE FRAUDE",
        email: "prevencion@apuestatotal.com",
        password: bcrypt.hashSync("password", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const user = await queryInterface.sequelize.query(
      `SELECT id from Users WHERE email = 'prevencion@apuestatotal.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    return queryInterface.bulkInsert("CustomTheme", [
      {
        userId: user[0].id,
        darkMode: false,
        fontSize: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Primero, elimina el tema
    await queryInterface.bulkDelete("CustomTheme", null, {});

    // Luego, elimina el usuario
    return queryInterface.bulkDelete("Users", null, {});
  },
};