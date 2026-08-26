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
    const { utilisateur_id } = req.body || {};
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];
    const pool = getPool();
    await pool.query(
      `UPDATE pointages SET heure_depart = $1 WHERE utilisateur_id = $2 AND date_pointage = $3`,
      [now, utilisateur_id, today]
    );
    return res.status(200).json({ message: 'Départ enregistré.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
