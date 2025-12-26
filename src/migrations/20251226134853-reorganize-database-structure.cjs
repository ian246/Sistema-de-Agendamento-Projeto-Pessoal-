'use strict';

/** @type {import('sequelize-cli').Migra'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('profiles');
    const servicesTable = await queryInterface.describeTable('services');
    const appointmentsTable = await queryInterface.describeTable('appointments');

    // Helper para adicionar coluna só se não existir
    const addCol = async (table, colName, options) => {
      try {
        const info = await queryInterface.describeTable(table);
        if (!info[colName]) {
          await queryInterface.addColumn(table, colName, options);
        }
      } catch (e) {
        console.log(`Skipping addColumn(${table}, ${colName}):`, e.message);
      }
    };

    // 1. MELHORAR PERFIL (PROFILES)
    await addCol('profiles', 'full_name', { type: Sequelize.STRING, allowNull: true });
    await addCol('profiles', 'phone', { type: Sequelize.STRING, allowNull: true });
    await addCol('profiles', 'avatar_url', { type: Sequelize.STRING, allowNull: true });

    // Role precisa de tratamento especial se já existir mas não tiver default
    if (!tableInfo.role) {
      await queryInterface.addColumn('profiles', 'role', {
        type: Sequelize.STRING,
        defaultValue: 'client',
        allowNull: false
      });
    }

    // 2. VINCULAR SERVIÇO AO BARBEIRO (SERVICES)
    await addCol('services', 'provider_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'profiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // 3. ORGANIZAR AGENDAMENTO (APPOINTMENTS)
    await addCol('appointments', 'client_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'profiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await addCol('appointments', 'provider_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'profiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await addCol('appointments', 'service_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'services', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await addCol('appointments', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Desfaz tudo se der erro
    await queryInterface.removeColumn('appointments', 'status');
    await queryInterface.removeColumn('appointments', 'service_id');
    await queryInterface.removeColumn('appointments', 'provider_id');
    await queryInterface.removeColumn('appointments', 'client_id');
    await queryInterface.removeColumn('services', 'provider_id');
    await queryInterface.removeColumn('profiles', 'role');
    await queryInterface.removeColumn('profiles', 'avatar_url');
    await queryInterface.removeColumn('profiles', 'phone');
    await queryInterface.removeColumn('profiles', 'full_name');
  }
};
