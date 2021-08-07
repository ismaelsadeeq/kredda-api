'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class creditCard extends Model {
  };
  creditCard.associate = function(models){
    creditCard.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  creditCard.init({
    cardType: DataTypes.STRING,
    cardNumber: DataTypes.STRING,
    expiryMonth: DataTypes.STRING,
    expiryYear: DataTypes.STRING,
    authCode: DataTypes.STRING,
    bankName: DataTypes.STRING,
    bankCode: DataTypes.STRING,
    isDefault: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'creditCard',
  });
  return creditCard;
};