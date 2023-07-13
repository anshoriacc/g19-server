'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VehicleImage extends Model {
    static associate({ Vehicle }) {
      this.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
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
