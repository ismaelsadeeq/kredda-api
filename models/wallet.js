'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
  };
  wallet.associate = function(models){
    wallet.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  wallet.init({
    accountBalance: DataTypes.STRING,
    customerCode: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'wallet',
  });
  return wallet;
};