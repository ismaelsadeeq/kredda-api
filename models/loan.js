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
    amount: DataTypes.INTEGER,
    amountToBePaid:DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
    amoundPaid: DataTypes.INTEGER,
    remainingBalance: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN,
    dueDate:DataTypes.DATE,
    hasPenalty:DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loan',
  });
  return loan;
};