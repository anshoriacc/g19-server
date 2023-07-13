'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourImage extends Model {
    static associate({ Tour }) {
      this.belongsTo(Tour, { foreignKey: 'tour_id' });
    }
  }
  TourImage.init(
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
      sequelize,
      modelName: 'TourImage',
      paranoid: true,
      underscored: true,
    }
  );
  return TourImage;
};
