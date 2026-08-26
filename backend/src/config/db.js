const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    process.env.DATABASE_URL 
        ? { connectionString: process.env.DATABASE_URL }
        : {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'harmonie_db',
            password: process.env.DB_PASSWORD || 'password',
            port: process.env.DB_PORT || 5432,
        }
);

pool.on('error', (err, client) => {
    console.error('Erreur inattendue sur le client PostgreSQL', err);
    process.exit(-1);
});

module.exports = pool;
