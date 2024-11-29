const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/database");

class TestSamsung extends Model {}

TestSamsung.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mac_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_time: {
      type: DataTypes.DATE,
      allowNull: false,
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