'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kyc extends Model {
  };
  kyc.associate = function(models){
    kyc.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  kyc.init({
    dob: DataTypes.STRING,
    bvnNumber: DataTypes.STRING,
    isBvnVerified: DataTypes.STRING,
    meansOfIdentification: DataTypes.STRING,
    status: DataTypes.STRING,
    kycLevel:DataTypes.STRING,
  }, {
    sequelize,
    paranoid:true,
    modelName: 'kyc',
  });
  return kyc;
};