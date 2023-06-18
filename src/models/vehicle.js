const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Vehicle = sequelize.define(
  'vehicle',
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
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    paranoid: true,
    underscored: true,
  }
);

module.exports = Vehicle;
