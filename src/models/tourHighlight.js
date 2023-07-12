'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourHighlight extends Model {
    static associate({ Tour }) {
      this.belongsTo(Tour);
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
      tourId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tour",
          key: "id"
        }
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
