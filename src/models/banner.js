'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate(models) {}
  }
  Banner.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Banner',
      paranoid: true,
      underscored: true,
    }
  );
  return Banner;
};
