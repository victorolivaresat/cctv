const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../../config/database");

class TestHv extends Model {
  /**
   * Helper method for defining associations.
   */
}

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
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TestHv",
    tableName: "TestHv",
    timestamps: false,
  }
);

module.exports = TestHv;
