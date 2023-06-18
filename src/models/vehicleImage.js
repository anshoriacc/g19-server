const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const VehicleImage = sequelize.define(
  'vehicleImage',
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

module.exports = VehicleImage;
