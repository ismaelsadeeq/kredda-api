'use strict';
const uuid = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID,
        defaultValue:uuid.v4()
      },
      dob: {
        type: Sequelize.STRING
      },
      bvnNumber: {
        type: Sequelize.STRING
      },
      isBvnVerified: {
        type: Sequelize.STRING
      },
      meansOfIdentification: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('kycs');
  }
};