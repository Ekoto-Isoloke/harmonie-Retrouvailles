const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  // GET : Récupérer l'empreinte faciale d'un utilisateur
  if (req.method === 'GET') {
    const { email } = req.query || {};
    if (!email) return res.status(400).json({ message: 'Email requis' });

    try {
      const rows = await sql`SELECT face_data, face_enrolled_at FROM utilisateurs WHERE LOWER(email) = ${email.toLowerCase().trim()}`;
      if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });

      return res.status(200).json({
        enrolled: !!rows[0].face_data,
        face_data: rows[0].face_data || null,
        face_enrolled_at: rows[0].face_enrolled_at || null
      });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
    }
  }

  // POST : Enregistrer ou mettre à jour l'empreinte faciale
  if (req.method === 'POST') {
    const { email, face_data } = req.body || {};
    if (!email || !face_data) {
      return res.status(400).json({ message: 'Email et face_data requis' });
    }

    // Validation : face_data doit être un data URI JPEG/PNG valide
    if (!face_data.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Format face_data invalide. Doit être un data:image/...' });
    }

    // Limiter la taille (max ~500KB pour une photo faciale)
    if (face_data.length > 500000) {
      return res.status(400).json({ message: 'Image faciale trop volumineuse (max 500KB)' });
    }

    try {
      const result = await sql`
        UPDATE utilisateurs 
        SET face_data = ${face_data}, face_enrolled_at = NOW()
        WHERE LOWER(email) = ${email.toLowerCase().trim()}
        RETURNING id, nom, prenom, email, face_enrolled_at
      `;

      if (result.length === 0) {
        return res.status(404).json({ message: 'Utilisateur introuvable pour cet email' });
      }

      return res.status(200).json({
        message: 'Empreinte faciale enregistrée avec succès dans le cloud',
        user: result[0],
        enrolled: true
      });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
};
