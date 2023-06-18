const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const TourDate = sequelize.define(
  'tourDate',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = TourDate;
