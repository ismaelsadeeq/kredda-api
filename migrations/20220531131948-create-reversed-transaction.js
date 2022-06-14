'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reversedTransactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true
      },
      adminId:{
        type:Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'admins',
          key:'id',
          as:'adminId'
        }
      },
      transactionId:{
        type:Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'transactions',
          key:'id',
          as:'transactionId'
        }
      },
      transactionType: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      beneficiary: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      totalServiceFee: {
        type: Sequelize.STRING
      },
      addon: {
        type: Sequelize.STRING
      },
      typeOfReversal: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('reversedTransactions');
  }
};