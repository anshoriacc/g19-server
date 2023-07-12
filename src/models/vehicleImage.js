'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VehicleImage extends Model {
    static associate({ Vehicle }) {
      this.belongsTo(Vehicle);
    }
  }
  VehicleImage.init(
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
      vehicleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Vehicle",
          key: "id"
        }
      },
    },
    {
      sequelize,
      modelName: 'VehicleImage',
      paranoid: true,
      underscored: true,
    }
  );
  return VehicleImage;
};
