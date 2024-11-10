'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {

    const statusValues = ['new', 'pending', 'completed'];
    
    await queryInterface.createTable('SuportEventSamsung', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idEventSamsung: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name:{
        allowNull: false,
        type: Sequelize.STRING
      },
      macAddress:{
        allowNull: false,
        type: Sequelize.STRING
      },
      eventName:{
        allowNull: false,
        type: Sequelize.TEXT
      },
      dateTime:{
        allowNull: false,
        type: Sequelize.DATE
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
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('SuportEventsSamsung');
  }
};
