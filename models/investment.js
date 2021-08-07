'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class investment extends Model {
  };
  investment.associate = function(models){
    investment.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  investment.init({
    isRedemmed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'investment',
  });
  return investment;
};