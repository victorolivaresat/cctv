const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../config/database");
const { format } = require("../../utils/dateUtils");

class EventSamsung extends Model {}

EventSamsung.init(
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
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'date_time',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status',
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'observations',
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'attachment',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: "EventSamsung",
    tableName: "event_samsung",
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = EventSamsung;