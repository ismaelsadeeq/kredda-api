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
    investment.belongsTo(models.investmentCategory,{
      foreignKey:'investmentCategoryId'
    })
  }
  investment.init({
    payout:DataTypes.BOOLEAN,
    autoRenewal:DataTypes.BOOLEAN,
    dueDate :DataTypes.DATE,
    unit:DataTypes.STRING,
    isRedemmed: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'investment',
  });
  return investment;
};