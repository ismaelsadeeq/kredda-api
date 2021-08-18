'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loanCategory extends Model {
  };
  loanCategory.associate = function(models){
    loanCategory.hasMany(models.loan,{
      foreignKey:'loanCategoryId'
    });
  }
  loanCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    interestRate: DataTypes.STRING,
    defaultInterest: DataTypes.STRING,
    interestAmount: DataTypes.STRING,
    maximumAmount: DataTypes.STRING,
    maximumDuration: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    hasExpiryFee: DataTypes.BOOLEAN,
    expiryFeeAmount: DataTypes.STRING,
    expiryPercentage: DataTypes.STRING,
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loanCategory',
  });
  return loanCategory;
};