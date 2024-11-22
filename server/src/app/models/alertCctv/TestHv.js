const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../config/database");

class TestHv extends Model {}

TestHv.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'message',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'date',
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