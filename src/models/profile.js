'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate({ User }) {
      this.belongsTo(User, { onDelete: 'RESTRICT' });
    }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Profile',
      paranoid: true,
      underscored: true,
    }
  );
  return Profile;
};
