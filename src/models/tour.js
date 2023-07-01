'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate({
      Reservation,
      TourDate,
      TourItinerary,
      TourHighlight,
      TourImage,
    }) {
      this.hasMany(Reservation, { onDelete: 'NO ACTION' });
      this.hasMany(TourDate, { onDelete: 'CASCADE', as: 'tourDates' });
      this.hasMany(TourItinerary, {
        onDelete: 'CASCADE',
        as: 'tourItineraries',
      });
      this.hasMany(TourHighlight, {
        onDelete: 'CASCADE',
        as: 'tourHighlights',
      });
      this.hasMany(TourImage, { onDelete: 'CASCADE', as: 'tourImages' });
    }
  }
  Tour.init(
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
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      availability: {
        type: DataTypes.ENUM('everyday', 'scheduled'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Tour',
      paranoid: true,
      underscored: true,
    }
  );
  return Tour;
};
