'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourHighlight extends Model {
    static associate({ Tour }) {
      this.belongsTo(Tour, { foreignKey: 'tour_id' });
    }
  }
  TourHighlight.init(
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
      sequelize,
      modelName: 'TourHighlight',
      paranoid: true,
      underscored: true,
    }
  );
  return TourHighlight;
};
