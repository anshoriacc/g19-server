'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate({ Reservation, VehicleImage }) {
      this.hasMany(Reservation, { onDelete: 'NO ACTION' });
      this.hasMany(VehicleImage, { onDelete: 'CASCADE', as: 'vehicleImages' });
    }
  }
  Vehicle.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      driverMandatory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      transmission: {
        type: DataTypes.ENUM('automatic', 'manual'),
        allowNull: false,
        defaultValue: 'manual',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Vehicle',
      paranoid: true,
      underscored: true,
    }
  );
  return Vehicle;
};
