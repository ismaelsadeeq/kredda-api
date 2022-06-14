'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loanCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      interestRate: {
        type: Sequelize.INTEGER
      },
      defaultInterest: {
        type: Sequelize.INTEGER
      },
      interestAmount: {
        type: Sequelize.INTEGER
      },
      maximumAmount: {
        type: Sequelize.INTEGER
      },
      maximumDuration: {
        type: Sequelize.STRING
      },
      hasExpiryFee :{
        type: Sequelize.BOOLEAN
      },
      expiryFeeAmount :{
        type: Sequelize.INTEGER
      },
      expiryPercentage :{
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('loanCategories');
  }
};