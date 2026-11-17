const pool = require('../config/db');

// Lister tous les comptes en attente
exports.getComptesEnAttente = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nom, prenom, email, role, telephone, ecole_id, created_at 
       FROM utilisateurs 
       WHERE statut_compte = 'en_attente' 
       ORDER BY created_at DESC`
    );
    res.json({ comptes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Approuver un compte
exports.approuverCompte = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE utilisateurs SET statut_compte = 'approuve' WHERE id = $1 RETURNING id, nom, prenom, email, role`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: `Compte de ${rows[0].prenom} ${rows[0].nom} approuvé avec succès.`, utilisateur: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Rejeter un compte
exports.rejeterCompte = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE utilisateurs SET statut_compte = 'rejete' WHERE id = $1 RETURNING id, nom, prenom, email, role`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: `Compte de ${rows[0].prenom} ${rows[0].nom} rejeté.`, utilisateur: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Lister tous les comptes (avec filtre optionnel)
exports.getTousLesComptes = async (req, res) => {
  try {
    const { statut } = req.query;
    let query = `SELECT id, nom, prenom, email, role, telephone, ecole_id, statut_compte, created_at FROM utilisateurs`;
    const values = [];
    if (statut) {
      query += ` WHERE statut_compte = $1`;
      values.push(statut);
    }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, values);
    res.json({ comptes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
