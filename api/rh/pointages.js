const { getPool } = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM pointages ORDER BY date_pointage DESC, heure_arrivee DESC LIMIT 200`
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
