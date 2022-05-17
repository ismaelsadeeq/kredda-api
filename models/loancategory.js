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
    interestRate: DataTypes.INTEGER,
    defaultInterest: DataTypes.INTEGER,
    interestAmount: DataTypes.INTEGER,
    maximumAmount: DataTypes.INTEGER,
    maximumDuration: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    hasExpiryFee: DataTypes.BOOLEAN,
    expiryFeeAmount: DataTypes.INTEGER,
    expiryPercentage: DataTypes.INTEGER,
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loanCategory',
  });
  return loanCategory;
};