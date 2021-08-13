'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otherAccount extends Model {
  };
  otherAccount.associate = function(models){
    otherAccount.belongsTo(models.accountType,{
      foreignKey:'accountTypeId'
    });
    otherAccount.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  otherAccount.init({
    accountBalance: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'otherAccount',
  });
  return otherAccount;
};