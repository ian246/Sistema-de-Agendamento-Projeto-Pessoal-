import Sequelize from 'sequelize';
import databaseConfig from '../config/database.cjs';
import ProfileModel from './Profile.js';
import ServiceModel from './Service.js';
import AppointmentModel from './Appointment.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
    Profile: ProfileModel(sequelize, Sequelize.DataTypes),
    Service: ServiceModel(sequelize, Sequelize.DataTypes),
    Appointment: AppointmentModel(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
