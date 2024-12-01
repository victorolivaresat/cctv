'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('event_hv', {
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
      event_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dvr_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dvr_serial_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      camera_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'new'
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachment: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('event_hv');
  }
};