const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Profile = sequelize.define(
  'profile',
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
    paranoid: true,
    underscored: true,
  }
);

module.exports = Profile;
