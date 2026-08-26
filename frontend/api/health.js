import { getPool } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    const dbRes = await pool.query('SELECT NOW()');
    return res.status(200).json({
      status: 'OK',
      message: 'API Harmonie-Retrouvailles en ligne et connectée à Neon PostgreSQL !',
      database_time: dbRes.rows[0].now,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Erreur de connexion à la base de données Neon: ' + err.message
    });
  }
}
