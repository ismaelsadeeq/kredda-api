'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
  };
  user.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    emailVerifiedAt: DataTypes.DATE,
    city: DataTypes.STRING,
    isActive: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    referralCode: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'user',
  });
  return user;
};