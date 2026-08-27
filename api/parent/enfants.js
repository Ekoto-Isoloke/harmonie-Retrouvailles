const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    const parentId = req.query.parent_id;
    if (!parentId) {
      return res.status(400).json({ message: 'parent_id manquant' });
    }

    const enfants = await sql`
      SELECT id, matricule, nom, postnom, prenom, classe, ecole, ecole_provenance 
      FROM etudiants 
      WHERE parent_id = ${parentId}
      ORDER BY id ASC
    `;

    return res.status(200).json({ 
      success: true, 
      enfants: enfants
    });

  } catch (err) {
    console.error('Erreur enfants:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur: ' + err.message });
  }
};
