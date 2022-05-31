'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reversedTransaction extends Model {
  };
  reversedTransaction.associate = function(models){
    reversedTransaction.belongsTo(models.transaction,{
      foreignKey:'transactionId'
    });
    reversedTransaction.belongsTo(models.admin,{
      foreignKey:'adminId'
    });
  }
  reversedTransaction.init({
    transactionType: DataTypes.STRING,
    amount: DataTypes.STRING,
    status: DataTypes.STRING,
    beneficiary: DataTypes.STRING,
    time: DataTypes.STRING,
    totalServiceFee: DataTypes.STRING,
    addon: DataTypes.STRING,
    typeOfReversal: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'reversedTransaction',
  });
  return reversedTransaction;
};