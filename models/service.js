'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service extends Model {
  };
  service.associate = function(models){
    service.belongsTo(models.serviceCategory,{
      foreignKey:'serviceCategoryId'
    });
    service.hasMany(models.serviceTransaction,{
      foreignKey:'serviceId'
    });
  }
  service.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    logo: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'service',
  });
  return service;
};