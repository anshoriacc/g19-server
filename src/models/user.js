'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Profile, Token, Reservation }) {
      this.hasOne(Profile, { onDelete: 'CASCADE', as: 'profile' });
      this.hasOne(Token, { onDelete: 'CASCADE' });
      this.hasMany(Reservation, { onDelete: 'NO ACTION' });
    }
  }
  User.init(
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
      sequelize,
      modelName: 'User',
      paranoid: true,
      underscored: true,
    }
  );
  return User;
};
