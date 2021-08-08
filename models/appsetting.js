'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appSetting extends Model {
  };
  appSetting.init({
    siteName: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
    currency: DataTypes.STRING,
    purpose: DataTypes.STRING,
    isActive: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'appSetting',
  });
  return appSetting;
};