const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Token = sequelize.define(
  'token',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    underscored: true,
  }
);

module.exports = Token;
