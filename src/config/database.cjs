require('dotenv').config();

const config = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

console.log('--- Database Config Loaded ---');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

module.exports = {
    development: config,
    test: config,
    production: config
};
