'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
  };
  transaction.associate = function(models){
    transaction.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  transaction.init({
    transactionType: DataTypes.STRING,
    message: DataTypes.STRING,
    reference: DataTypes.STRING,
    status:DataTypes.STRING,
    amount: DataTypes.STRING,
    time:DataTypes.STRING,
    beneficiary: DataTypes.STRING,
    description: DataTypes.STRING,
    isRedemmed: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'transaction',
  });
  return transaction;
};