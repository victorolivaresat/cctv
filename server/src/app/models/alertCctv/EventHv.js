const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../../../config/database");

class EventHv extends Model {
  /**
   * Helper method for defining associations.
   */
}

EventHv.init(
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
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dvrName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dvrSerialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cameraName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "pending", "completed"),
      allowNull: true,
      defaultValue: "new",
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachment: {
      type: [DataTypes.STRING],
      allowNull: true,
      defaultValue: [],
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
    modelName: "EventHv",
    tableName: "EventHv",
    timestamps: true,
  }
);

module.exports = EventHv;
