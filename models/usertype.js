'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userType extends Model {
  };
  userType.associate = function(models){
    userType.belongsTo(models.user,{
      foreignKey:'userId'
    });
    userType.belongsTo(models.userCategory,{
      foreignKey:'userCategoryId'
    });
  }
  userType.init({
    dueDate: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'userType',
  });
  return userType;
};