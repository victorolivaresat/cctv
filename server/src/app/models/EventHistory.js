const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/database");

class EventHistory extends Model {}

EventHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    sequelize,
    modelName: "EventHistory",
    tableName: "event_history", 
    timestamps: false, 
  }
);

module.exports = EventHistory;
