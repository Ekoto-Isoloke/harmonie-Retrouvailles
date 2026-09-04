const { getPool } = require('../../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { utilisateur_id, nom, role, ecole } = req.body || {};
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pointages (
        id SERIAL PRIMARY KEY,
        utilisateur_id INT,
        nom VARCHAR(150),
        role VARCHAR(100),
        ecole VARCHAR(50),
        date_pointage DATE DEFAULT CURRENT_DATE,
        heure_arrivee VARCHAR(20),
        heure_depart VARCHAR(20),
        statut VARCHAR(50) DEFAULT 'Présent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(
      `INSERT INTO pointages (utilisateur_id, nom, role, ecole, date_pointage, heure_arrivee, statut)
       VALUES ($1, $2, $3, $4, $5, $6, 'Présent')`,
      [utilisateur_id, nom, role, ecole, today, now]
    );
    return res.status(200).json({ message: 'Arrivée enregistrée.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
