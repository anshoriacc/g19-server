const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Email tidak boleh kosong.',
        },
        isEmail: {
          msg: 'Email tidak sesuai.',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Username tidak boleh kosong.',
        },
        isAlphanumeric: {
          msg: 'Username hanya boleh terdiri dari huruf dan angka.',
        },
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationCode: { type: DataTypes.STRING },
    otp: { type: DataTypes.STRING },
  },
  {
    paranoid: true,
    underscored: true,
  }
);

module.exports = User;
