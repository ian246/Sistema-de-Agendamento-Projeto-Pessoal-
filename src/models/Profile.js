import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models) {
            // Associação 1: Barbeiro tem serviços
            this.hasMany(models.Service, { foreignKey: 'provider_id', as: 'services' });

            // Associação 2: Cliente faz agendamentos
            this.hasMany(models.Appointment, { foreignKey: 'client_id', as: 'my_bookings' });

            // Associação 3: Barbeiro recebe agendamentos
            this.hasMany(models.Appointment, { foreignKey: 'provider_id', as: 'schedule' });
        }
    }
    Profile.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        full_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        avatar_url: DataTypes.STRING,
        role: {
            type: DataTypes.STRING,
            defaultValue: 'client'
        }
    }, {
        sequelize,
        modelName: 'Profile',
        tableName: 'profiles',
        underscored: true,
    });
    return Profile;
};
