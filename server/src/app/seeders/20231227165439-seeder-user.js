"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password", 10);

    await queryInterface.bulkInsert("users", [
      {
        username: "prevencion.fraude",
        email: "prevencion@apuestatotal.com",
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("users", {
      email: "prevencion@apuestatotal.com",
    });
  },
};
