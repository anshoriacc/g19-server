'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate({ User }) {
      this.belongsTo(User);
    }
  }
  Token.init(
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
      sequelize,
      modelName: 'Token',
      underscored: true,
    }
  );
  return Token;
};
