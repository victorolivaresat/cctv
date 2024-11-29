'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('test_hv', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      message: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      event_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('test_hv');
  }
};