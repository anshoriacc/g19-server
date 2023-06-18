const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const TourItinerary = sequelize.define(
  'tourItinerary',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    time: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    itinerary: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = TourItinerary;
