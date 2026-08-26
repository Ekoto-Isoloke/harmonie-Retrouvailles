const { getPool } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT id, nom, prenom, email, role, ecole, statut, created_at FROM utilisateurs ORDER BY created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nom, prenom, email, password, role, ecole } = req.body || {};
      const { rows } = await pool.query(
        `INSERT INTO utilisateurs (nom, prenom, email, password, role, ecole, statut)
         VALUES ($1, $2, $3, $4, $5, $6, 'Actif')
         ON CONFLICT (email) DO NOTHING
         RETURNING id, nom, prenom, email, role, ecole, statut`,
        [nom, prenom, (email || '').toLowerCase().trim(), password, role, ecole]
      );

      if (rows.length === 0) {
        return res.status(409).json({ message: 'Un compte avec cet email existe déjà.' });
      }

      return res.status(201).json({ message: 'Compte créé avec succès.', user: rows[0] });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
};
