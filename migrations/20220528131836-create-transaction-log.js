'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactionLogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID,
        defaultValue:uuid.v4()
      },
      adminId:{
        type:Sequelize.UUID,
        allowNull:false,
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
      description: {
        type: Sequelize.STRING
      },
      trxType: {
        type: Sequelize.STRING
      },
      time:{
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
    await queryInterface.dropTable('transactionLogs');
  }
};