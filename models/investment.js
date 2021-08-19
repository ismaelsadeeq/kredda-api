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
    payout:DataTypes.BOOLEAN,
    autoRenewal:DataTypes.BOOLEAN,
    dueDate :DataTypes.DATE,
    isRedemmed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'investment',
  });
  return investment;
};