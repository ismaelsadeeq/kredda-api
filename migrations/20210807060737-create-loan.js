'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loans', {
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
      loanCategoryId:{
        type:Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'loanCategories',
          key:'id',
          as:'loanCategoryId'
        }
      },
      amount :{
        type: Sequelize.INTEGER
      },
      isApproved: {
        type: Sequelize.BOOLEAN
      },
      amountToBePaid :{
        type: Sequelize.INTEGER
      },
      amoundPaid: {
        type: Sequelize.INTEGER
      },
      remainingBalance: {
        type: Sequelize.INTEGER
      },
      isPaid: {
        type: Sequelize.BOOLEAN
      },
      dueDate :{
        type: Sequelize.DATE
      },
      hasPenalty :{
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
    await queryInterface.dropTable('loans');
  }
};