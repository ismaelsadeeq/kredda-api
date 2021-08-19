'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class investmentCategory extends Model {
  };
  investmentCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    organization: DataTypes.STRING,
    interestRate: DataTypes.STRING,
    pricePerUnit:DataTypes.STRING,
    period: DataTypes.STRING,
    picture: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'investmentCategory',
  });
  return investmentCategory;
};