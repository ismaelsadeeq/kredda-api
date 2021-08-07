'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank extends Model {
  };
  bank.init({
    bankName: DataTypes.STRING,
    bankCode: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    isAccountValid: DataTypes.BOOLEAN,
    recipientCode: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'bank',
  });
  return bank;
};