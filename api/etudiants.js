const { getPool } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const pool = getPool();

    // Auto-migration : créer la table etudiants si inexistante
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etudiants (
        id SERIAL PRIMARY KEY,
        matricule VARCHAR(50) UNIQUE,
        nom VARCHAR(100) NOT NULL,
        postnom VARCHAR(100),
        prenom VARCHAR(100) NOT NULL,
        sexe VARCHAR(10),
        date_naissance DATE,
        lieu_naissance VARCHAR(100),
        nationalite VARCHAR(50),
        province_origine VARCHAR(100),
        adresse TEXT,
        ecole_provenance VARCHAR(150),
        classe VARCHAR(100),
        section VARCHAR(100),
        option_etude VARCHAR(100),
        ecole VARCHAR(50),
        type_inscription VARCHAR(50),
        parent_id INT,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const { ecole, classe, section, option_etude } = req.query || {};
    let query = `SELECT * FROM etudiants WHERE 1=1`;
    const params = [];

    if (ecole) {
      params.push(ecole.toLowerCase());
      query += ` AND LOWER(ecole) = $${params.length}`;
    }
    if (classe) {
      params.push(classe);
      query += ` AND classe = $${params.length}`;
    }
    if (section) {
      params.push(section);
      query += ` AND section = $${params.length}`;
    }
    if (option_etude) {
      params.push(option_etude);
      query += ` AND option_etude = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC, nom ASC`;
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur API etudiants:', error);
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
