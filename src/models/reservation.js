const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Reservation = sequelize.define(
  'reservation',
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
    status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'confirmed',
        'on going',
        'finished'
      ),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = Reservation;
