'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourItinerary extends Model {
    static associate({ Tour }) {
      this.belongsTo(Tour, { foreignKey: 'tour_id' });
    }
  }
  TourItinerary.init(
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
      sequelize,
      modelName: 'TourItinerary',
      paranoid: true,
      underscored: true,
    }
  );
  return TourItinerary;
};
