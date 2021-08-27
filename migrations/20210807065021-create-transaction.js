'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID,
        defaultValue:uuid.v4()
      },
      userId:{
        type:Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'users',
          key:'id',
          as:'userId'
        }
      },
      transactionType: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      beneficiary: {
        type: Sequelize.STRING(1234)
      },
      description: {
        type: Sequelize.STRING
      },
      time:{
        type: Sequelize.STRING
      },
      status:{
        type:Sequelize.STRING
      },
      isRedemmed :{
        type:Sequelize.BOOLEAN
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};