'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('serviceTransactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      userId:{
        type:Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'users',
          key:'id',
          as:'userId'
        }
      },
      serviceId:{
        type:Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'services',
          key:'id',
          as:'serviceId'
        }
      },
      reference: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      beneficiary: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      totalServiceFee: {
        type: Sequelize.INTEGER
      },
      profit: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('serviceTransactions');
  }
};