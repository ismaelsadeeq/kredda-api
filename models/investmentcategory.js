'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class investmentCategory extends Model {
  };
  investmentCategory.associate = function(models){
    investmentCategory.hasMany(models.investment,{
      foreignKey:'investmentCategoryId'
    })
  }
  investmentCategory.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    organization: DataTypes.STRING,
    interestRate: DataTypes.INTEGER,
    maximumPurchaseUnit:DataTypes.INTEGER,
    pricePerUnit:DataTypes.INTEGER,
    status:DataTypes.BOOLEAN,
    period: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'investmentCategory',
  });
  return investmentCategory;
};