'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('investmentCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID,
        defaultValue:uuid.v4()
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      maximumPurchaseUnit:{
        type: Sequelize.INTEGER
      },
      pricePerUnit :{
        type: Sequelize.INTEGER
      },
      interestRate: {
        type: Sequelize.INTEGER
      },
      period: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('investmentCategories');
  }
};