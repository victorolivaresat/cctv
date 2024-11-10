const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../../config/database");

class TestSamsung extends Model {
  /**
   * Helper method for defining associations.
   */
}

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
    macAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TestSamsung",
    tableName: "TestSamsung",
    timestamps: false,
  }
);

module.exports = TestSamsung;
