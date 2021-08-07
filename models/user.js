'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
  };
  user.associate = function(models){
    user.hasOne(models.kyc,{
      foreignKey:'userId'
    });
    user.hasMany(models.bank,{
      foreignKey:'userId'
    });
    user.hasMany(models.creditCard,{
      foreignKey:'userId'
    });
    user.hasOne(models.wallet,{
      foreignKey:'userId'
    });
    user.hasMany(models.investment,{
      foreignKey:'userId'
    });
    user.hasMany(models.loan,{
      foreignKey:'userId'
    });
    user.hasMany(models.saving,{
      foreignKey:'userId'
    });
    user.hasMany(models.transaction,{
      foreignKey:'userId'
    });
  }
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