'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('services');

        if (!tableInfo.duration) {
            await queryInterface.addColumn('services', 'duration', {
                type: Sequelize.INTEGER, // Inteiro para minutos
                defaultValue: 30, // 30 min default
                allowNull: true // Seguro para inserts anteriores
            });
            console.log("Column 'duration' added to 'services' table.");
        } else {
            console.log("Column 'duration' already exists in 'services' table.");
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('services');
        if (tableInfo.duration) {
            await queryInterface.removeColumn('services', 'duration');
        }
    }
};
