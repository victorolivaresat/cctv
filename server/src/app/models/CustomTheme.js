const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database").sequelize;

class CustomTheme extends Model {}

CustomTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'dark_mode',
    },
    fontSize: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'font_size',
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
    modelName: "CustomTheme",
    tableName: "custom_theme",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = CustomTheme;