'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
  };
  loan.associate = function(models){
    loan.belongsTo(models.user,{
      foreignKey:'userId'
    });
    loan.belongsTo(models.loanCategory,{
      foreignKey:'loanCategoryId'
    });
  }
  loan.init({
    isApproved: DataTypes.STRING,
    amoundPaid: DataTypes.STRING,
    remainingBalance: DataTypes.STRING,
    isPaid: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loan',
  });
  return loan;
};