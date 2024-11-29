const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/database");

class TestHv extends Model {}

TestHv.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
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
    modelName: "TestHv",
    tableName: "test_hv",
    timestamps: false,
  }
);

module.exports = TestHv;