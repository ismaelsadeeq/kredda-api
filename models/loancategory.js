'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loanCategory extends Model {
  };
  loanCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    interestRate: DataTypes.STRING,
    defaultInterest: DataTypes.STRING,
    interestAmount: DataTypes.STRING,
    maximumAmount: DataTypes.STRING,
    maximumDuration: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loanCategory',
  });
  return loanCategory;
};