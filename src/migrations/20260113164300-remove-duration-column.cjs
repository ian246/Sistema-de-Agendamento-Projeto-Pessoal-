'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('services');

        // Remove a coluna 'duration' se existir (ficamos apenas com duration_minutes)
        if (tableInfo.duration) {
            await queryInterface.removeColumn('services', 'duration');
            console.log("Column 'duration' removed from 'services' table. Using only 'duration_minutes' now.");
        } else {
            console.log("Column 'duration' does not exist. Nothing to remove.");
        }
    },

    async down(queryInterface, Sequelize) {
        // Se precisar reverter, adiciona a coluna de volta
        const tableInfo = await queryInterface.describeTable('services');
        if (!tableInfo.duration) {
            await queryInterface.addColumn('services', 'duration', {
                type: Sequelize.INTEGER,
                defaultValue: 30,
                allowNull: true
            });
        }
    }
};
