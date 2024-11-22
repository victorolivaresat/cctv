const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../config/database");

class EventHv extends Model {}

EventHv.init(
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
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_type',
    },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'event_time',
    },
    dvrName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dvr_name',
    },
    dvrSerialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dvr_serial_number',
    },
    cameraName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'camera_name',
    },
    status: {
      type: DataTypes.ENUM("new", "pending", "completed"),
      allowNull: true,
      defaultValue: "new",
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
    modelName: "EventHv",
    tableName: "event_hv",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = EventHv;