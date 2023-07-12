'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourDate extends Model {
    static associate({ Tour }) {
      this.belongsTo(Tour);
    }
  }
  TourDate.init(
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
      modelName: 'TourDate',
      paranoid: true,
      underscored: true,
    }
  );
  return TourDate;
};
