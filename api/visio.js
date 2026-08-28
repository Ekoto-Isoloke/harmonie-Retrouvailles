const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    // Auto-migration : créer la table si elle n'existe pas
    const tableCheck = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_name = 'visioconferences'
    `;
    if (tableCheck.length === 0) {
      await sql`
        CREATE TABLE visioconferences (
          id SERIAL PRIMARY KEY,
          room_name VARCHAR(255) UNIQUE NOT NULL,
          titre VARCHAR(255) NOT NULL,
          initiateur VARCHAR(100),
          cibles VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }

    if (req.method === 'GET') {
      const activeSessions = await sql`
        SELECT * FROM visioconferences WHERE is_active = true ORDER BY created_at DESC
      `;
      return res.status(200).json(activeSessions);
    }

    if (req.method === 'POST') {
      const { room_name, titre, initiateur, cibles } = req.body || {};
      if (!room_name || !titre) return res.status(400).json({ message: 'Paramètres manquants' });

      await sql`
        INSERT INTO visioconferences (room_name, titre, initiateur, cibles)
        VALUES (${room_name}, ${titre}, ${initiateur || 'Admin'}, ${cibles || 'All'})
        ON CONFLICT (room_name) DO UPDATE SET is_active = true, created_at = CURRENT_TIMESTAMP
      `;
      return res.status(201).json({ success: true, room_name });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur API Visio:', err);
    return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
