'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accountType extends Model {
  };
  accountType.associate = function(models){
    accountType.hasMany(models.otherAccount,{
      foreignKey:'accountTypeId'
    });
  }
  accountType.init({
    name: DataTypes.STRING,
    currency: DataTypes.STRING,
    serviceFee: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'accountType',
  });
  return accountType;
};