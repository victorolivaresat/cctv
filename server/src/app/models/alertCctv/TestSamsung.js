const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../config/database");

class TestSamsung extends Model {}

TestSamsung.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
    },
    macAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mac_address',
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_name',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'message',
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'datetime',
    },
  },
  {
    sequelize,
    modelName: "TestSamsung",
    tableName: "test_samsung",
    timestamps: false, 
  }
);

module.exports = TestSamsung;