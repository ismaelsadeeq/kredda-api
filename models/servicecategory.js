'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceCategory extends Model {
  };
  serviceCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    serviceCharge: DataTypes.STRING,
    logo: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'serviceCategory',
  });
  return serviceCategory;
};