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
    transaction.hasMany(models.transactionLog,{
      foreignKey:'transactionId'
    });
  }
  transaction.init({
    transactionType: DataTypes.STRING,
    message: DataTypes.STRING,
    reference: DataTypes.STRING,
    status:DataTypes.STRING,
    amount: DataTypes.INTEGER,
    time:DataTypes.STRING,
    beneficiary: DataTypes.STRING(1234),
    totalServiceFee: DataTypes.INTEGER,
    description: DataTypes.STRING,
    profit: DataTypes.INTEGER,
    addon:DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'transaction',
  });
  return transaction;
};