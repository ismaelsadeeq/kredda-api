'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saving extends Model {
  };
  saving.associate = function(models){
    saving.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  saving.init({
    amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'saving',
  });
  return saving;
};