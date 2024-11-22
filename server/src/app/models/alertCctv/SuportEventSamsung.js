const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../config/database");

class SuportEventHv extends Model {}

SuportEventHv.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    idEventSamsung: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_event_samsung',
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
    typeDvr: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'type_dvr',
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
    modelName: "SuportEventHv",
    tableName: "suport_event_samsung",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = SuportEventHv;