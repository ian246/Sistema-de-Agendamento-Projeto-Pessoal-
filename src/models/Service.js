import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Service extends Model {
        static associate(models) {
            // Serviço pertence a um dono
            this.belongsTo(models.Profile, { foreignKey: 'provider_id', as: 'provider' });
        }
    }
    Service.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        duration: DataTypes.INTEGER,
        // provider_id handled by association/FK, but good to define if needed explicit
        provider_id: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'Service',
        tableName: 'services',
        underscored: true,
    });
    return Service;
};
