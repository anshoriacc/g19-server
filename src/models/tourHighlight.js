const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const TourHighlight = sequelize.define(
  'tourHighlight',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    highlight: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = TourHighlight;
