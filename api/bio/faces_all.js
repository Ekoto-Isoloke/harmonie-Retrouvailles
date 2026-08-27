const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    const rows = await sql
      SELECT id, nom, prenom, email, role, face_data 
      FROM utilisateurs 
      WHERE face_data IS NOT NULL
    ;
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
