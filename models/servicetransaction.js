'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceTransaction extends Model {
  };
  serviceTransaction.associate = function(models){
    serviceTransaction.belongsTo(models.user,{
      foreignKey:'userId'
    });
    serviceTransaction.belongsTo(models.service,{
      foreignKey:'serviceId'
    });
  }
  serviceTransaction.init({
    reference: DataTypes.STRING,
    amount: DataTypes.STRING,
    beneficiary: DataTypes.STRING,
    time: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    totalServiceFee: DataTypes.STRING,
    profit: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'serviceTransaction',
  });
  return serviceTransaction;
};