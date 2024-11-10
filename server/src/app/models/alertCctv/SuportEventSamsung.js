const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../../config/database");

class SuportEventSamsung extends Model {}

SuportEventSamsung.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    idEventSamsung: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "pending", "completed"),
      allowNull: true,
      defaultValue: "new",
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    typeDvr: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "SuportEventSamsung",
    tableName: "SuportEventSamsung",
    timestamps: true,
  }
);

module.exports = SuportEventSamsung;