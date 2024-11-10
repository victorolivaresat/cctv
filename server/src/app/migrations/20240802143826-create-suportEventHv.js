'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {

    const statusValues = ['new', 'pending', 'completed'];

    await queryInterface.createTable('SuportEventHv', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idEventHv: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name:{
        allowNull: false,
        type: Sequelize.STRING
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      eventTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dvrName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dvrSerialNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cameraName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(...statusValues),
        allowNull: true,
        defaultValue: 'new'
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachment: {
        type: [Sequelize.TEXT],
        allowNull: true,
        defaultValue: []
      },
      typeDvr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('SuportEventHv');
  }
};


