'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('appointments', 'cancellation_reason', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Motivo do cancelamento ou recusa pelo prestador'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('appointments', 'cancellation_reason');
    }
};
