'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceCategory extends Model {
  };
  serviceCategory.associate = function(models){
    serviceCategory.hasMany(models.service,{
      foreignKey:'serviceCategoryId'
    });
  }
  serviceCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    serviceCharge: DataTypes.STRING,
    logo: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'serviceCategory',
  });
  return serviceCategory;
};