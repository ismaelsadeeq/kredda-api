'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('investments', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
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
      investmentCategoryId:{
        type:Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'investmentCategories',
          key:'id',
          as:'investmentCategoryId'
        }
      },
      dueDate :{
        type: Sequelize.DATE
      },
      payout :{
        type: Sequelize.INTEGER
      },
      unit :{
        type: Sequelize.STRING
      },
      isRedemmed: {
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.BOOLEAN
      },
      autoRenewal :{
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
    await queryInterface.dropTable('investments');
  }
};