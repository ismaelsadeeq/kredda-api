'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
  };
  ticket.associate = function(models){
    ticket.belongsTo(models.user,{
      foreignKey:'userId'
    });
    ticket.hasMany(models.ticketReply,{
      foreignKey:'ticketId'
    });
  }
  ticket.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    attatchment: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'ticket',
  });
  return ticket;
};