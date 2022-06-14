'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true
      },
      name: {
        type: Sequelize.STRING
      },
      discountRate: {
        type: Sequelize.INTEGER
      },
      period: {
        type: Sequelize.STRING
      },
      fee: {
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
    await queryInterface.dropTable('userCategories');
  }
};