const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'POST uniquement' });

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    // Migration : ajouter photo_url à la table etudiants si elle n'existe pas
    const checkCol = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'etudiants' AND column_name = 'photo_url'
    `;

    if (checkCol.length === 0) {
      await sql`ALTER TABLE etudiants ADD COLUMN photo_url TEXT`;
      return res.status(200).json({ 
        success: true, 
        message: 'Colonne photo_url ajoutée à la table etudiants.' 
      });
    } else {
      return res.status(200).json({ 
        success: true, 
        message: 'Colonne photo_url existe déjà. Aucune modification nécessaire.' 
      });
    }

  } catch (err) {
    console.error('Erreur migration:', err);
    return res.status(500).json({ success: false, message: 'Erreur migration: ' + err.message });
  }
};
