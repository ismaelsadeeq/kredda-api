'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appSetting extends Model {
  };
  appSetting.init({
    siteName: DataTypes.STRING,
    testPublicKey:DataTypes.STRING,
    testPrivateKey:DataTypes.STRING,
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
    currency: DataTypes.STRING,
    purpose: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    accountNumber:DataTypes.BOOLEAN,
  }, {
    sequelize,
    paranoid:true,
    modelName: 'appSetting',
  });
  return appSetting;
};