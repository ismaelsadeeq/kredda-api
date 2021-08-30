'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank extends Model {
  };
  bank.associate = function(models){
    bank.belongsTo(models.user,{
      foreignKey:'userId'
    })
  }
  bank.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    bankName: DataTypes.STRING,
    bankCode: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    isAccountValid: DataTypes.BOOLEAN,
    recipientCode: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'bank',
  });
  return bank;
};