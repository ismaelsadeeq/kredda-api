'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCategory extends Model {
  };
  userCategory.init({
    name: DataTypes.STRING,
    discountRate: DataTypes.INTEGER,
    period: DataTypes.STRING,
    fee: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid:true,
    modelName: 'userCategory',
  });
  return userCategory;
};