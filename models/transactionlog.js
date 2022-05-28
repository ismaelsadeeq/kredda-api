'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactionLog extends Model {
  };
  transactionLog.associate = function(models){
    transactionLog.belongsTo(models.transaction,{
      foreignKey:'transactionId'
    })
    transactionLog.belongsTo(models.admin,{
      foreignKey:'adminId'
    });
  }
  transactionLog.init({
    description: DataTypes.STRING,
    trxType: DataTypes.STRING
    time:DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'transactionLog',
  });
  return transactionLog;
};