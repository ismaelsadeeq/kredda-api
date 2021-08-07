'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
  };
  admin.associate = function(models){
    admin.hasMany(models.otpCode,{
      foreignKey:'adminId'
    });
  }
  admin.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    isVerified: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    permission:DataTypes.STRING,
    isSuperAdmin:DataTypes.BOOLEAN,
    password: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'admin',
  });
  return admin;
};