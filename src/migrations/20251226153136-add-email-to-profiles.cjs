'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('profiles');
    if (!tableInfo.email) {
      await queryInterface.addColumn('profiles', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('profiles', 'email');
  }
};
