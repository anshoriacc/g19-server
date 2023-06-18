const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const TourImage = sequelize.define(
  'tourImage',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = TourImage;
