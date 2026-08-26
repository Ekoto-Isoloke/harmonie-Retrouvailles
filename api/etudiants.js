const { getPool } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    const { ecole, classe, section, option_etude } = req.query || {};
    let query = `SELECT * FROM etudiants WHERE 1=1`;
    const params = [];

    if (ecole) { params.push(ecole); query += ` AND ecole = $${params.length}`; }
    if (classe) { params.push(classe); query += ` AND classe = $${params.length}`; }
    if (section) { params.push(section); query += ` AND section = $${params.length}`; }
    if (option_etude) { params.push(option_etude); query += ` AND option_etude = $${params.length}`; }

    query += ` ORDER BY nom ASC`;
    const { rows } = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
