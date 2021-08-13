'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('otherAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      accountTypeId:{
        type:Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'accountTypes',
          key:'id',
          as:'accountTypeId'
        }
      },
      accountBalance: {
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
    await queryInterface.dropTable('otherAccounts');
  }
};