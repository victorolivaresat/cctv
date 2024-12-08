'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dvr_control', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dvr_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notification_email_in: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notification_email_out: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remote_connection_tool: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'None',
      },
      remote_connection_id: { 
        type: Sequelize.STRING,
        allowNull: true,
      },
      notifications_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      notes: { 
        type: Sequelize.TEXT,
        allowNull: true,
      },
      supervisor: { 
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: { 
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dvr_control');
  },
};
