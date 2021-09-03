'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCategory extends Model {
  };
  userCategory.init({
    name: DataTypes.STRING,
    discountRate: DataTypes.STRING,
    period: DataTypes.STRING,
    fee: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'userCategory',
  });
  return userCategory;
};