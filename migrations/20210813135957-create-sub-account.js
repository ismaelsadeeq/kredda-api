'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accountTypes', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      name:{
        type:Sequelize.STRING
      },
      currency:{
        type: Sequelize.STRING
      },
      currencyCode:{
        type: Sequelize.STRING
      },
      serviceFee:{
        type: Sequelize.STRING
      },
      status:{
        type:Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull:false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull:false,
        type:Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accountTypes');
  }
};