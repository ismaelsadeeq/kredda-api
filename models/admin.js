'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
  };
  admin.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    isVerified: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'admin',
  });
  return admin;
};