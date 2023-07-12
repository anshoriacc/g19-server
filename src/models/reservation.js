'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate({ User, Vehicle, Tour }) {
      this.belongsTo(User, { as: 'user' });
      this.belongsTo(Vehicle, { as: 'vehicle' });
      this.belongsTo(Tour, { as: 'tour' });
    }
  }
  Reservation.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.ENUM('rental', 'tour', 'carter'),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      addOn: {
        type: DataTypes.ENUM('driver'),
      },
      total: { type: DataTypes.INTEGER, allowNull: false },
      payment: {
        type: DataTypes.ENUM('cash', 'cashless'),
        allowNull: false,
      },
      paymentId: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4 },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'paid',
          'confirmed',
          'on going',
          'finished',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      vehicleId: {
        type: DataTypes.UUID,
        references: {
          model: 'Vehicle',
          key: 'id',
        },
      },
      tourId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Tour',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Reservation',
      paranoid: true,
      underscored: true,
    }
  );
  return Reservation;
};
