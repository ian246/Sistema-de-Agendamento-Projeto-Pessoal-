import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            // Agendamento conecta 3 pontas:
            this.belongsTo(models.Profile, { foreignKey: 'client_id', as: 'client' });
            this.belongsTo(models.Profile, { foreignKey: 'provider_id', as: 'provider' });
            this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service_details' });
        }
    }
    Appointment.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        client_id: DataTypes.UUID,
        provider_id: DataTypes.UUID,
        service_id: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'appointments',
        underscored: true,
    });
    return Appointment;
};
