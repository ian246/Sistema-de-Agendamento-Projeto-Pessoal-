'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('profiles');

        // Helper para adicionar coluna só se não existir
        const addCol = async (colName, options) => {
            try {
                if (!tableInfo[colName]) {
                    await queryInterface.addColumn('profiles', colName, options);
                    console.log(`Coluna ${colName} adicionada com sucesso.`);
                } else {
                    console.log(`Coluna ${colName} já existe, pulando...`);
                }
            } catch (e) {
                console.log(`Erro ao adicionar coluna ${colName}:`, e.message);
            }
        };

        // Adicionar campos de salão
        await addCol('salon_name', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await addCol('address', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await addCol('salon_image_url', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('profiles', 'salon_image_url');
        await queryInterface.removeColumn('profiles', 'address');
        await queryInterface.removeColumn('profiles', 'salon_name');
    }
};
