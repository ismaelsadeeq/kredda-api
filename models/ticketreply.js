'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticketReply extends Model {
  };
  ticketReply.associate = function(models){
    ticketReply.belongsTo(models.user,{
      foreignKey:'userId'
    });
    ticketReply.belongsTo(models.admin,{
      foreignKey:'adminId'
    });
    ticketReply.belongsTo(models.ticket,{
      foreignKey:'ticketId'
    });
  }
  ticketReply.init({
    body: DataTypes.STRING,
    attatchment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'ticketReply',
  });
  return ticketReply;
};