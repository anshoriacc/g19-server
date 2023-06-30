const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Banner = sequelize.define(
  'banner',
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
    paranoid: true,
    underscored: true,
  }
);

module.exports = Banner;
