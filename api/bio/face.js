const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  // ─── GET : Récupérer l'empreinte faciale d'un utilisateur ───
  if (req.method === 'GET') {
    const { email, user_id } = req.query || {};
    if (!email && !user_id) return res.status(400).json({ message: 'Email ou user_id requis' });

    try {
      let rows;
      if (user_id) {
        rows = await sql`SELECT id, nom, prenom, role, ecole, face_data, face_enrolled_at FROM utilisateurs WHERE id = ${user_id}`;
      } else {
        rows = await sql`SELECT id, nom, prenom, role, ecole, face_data, face_enrolled_at FROM utilisateurs WHERE LOWER(email) = ${email.toLowerCase().trim()}`;
      }
      if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });

      return res.status(200).json({
        enrolled: !!rows[0].face_data,
        face_data: rows[0].face_data || null,
        face_enrolled_at: rows[0].face_enrolled_at || null,
        user: {
          id: rows[0].id,
          nom: rows[0].nom,
          prenom: rows[0].prenom,
          role: rows[0].role,
          ecole: rows[0].ecole
        }
      });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
    }
  }

  // ─── POST : Enrôlement initial UNIQUEMENT (1ère capture faciale) ───
  // Une fois enrôlé, seul PUT avec autorisation Super-Admin peut modifier
  if (req.method === 'POST') {
    const { email, face_data } = req.body || {};
    if (!email || !face_data) {
      return res.status(400).json({ message: 'Email et face_data requis' });
    }

    if (!face_data.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Format face_data invalide' });
    }

    if (face_data.length > 500000) {
      return res.status(400).json({ message: 'Image faciale trop volumineuse (max 500KB)' });
    }

    try {
      // Vérifier si déjà enrôlé
      const check = await sql`SELECT id, face_data FROM utilisateurs WHERE LOWER(email) = ${email.toLowerCase().trim()}`;
      if (check.length === 0) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      // SÉCURITÉ : Si déjà enrôlé, refuser le POST → utiliser PUT avec Super-Admin
      if (check[0].face_data) {
        return res.status(403).json({ 
          message: '⛔ Ce compte a déjà une empreinte faciale enregistrée. Seul le Super-Admin peut la réinitialiser.',
          enrolled: true
        });
      }

      // Enrôlement initial
      const result = await sql`
        UPDATE utilisateurs 
        SET face_data = ${face_data}, face_enrolled_at = NOW()
        WHERE LOWER(email) = ${email.toLowerCase().trim()} AND face_data IS NULL
        RETURNING id, nom, prenom, email, role, face_enrolled_at
      `;

      if (result.length === 0) {
        return res.status(403).json({ message: 'Enrôlement refusé. Empreinte déjà existante.' });
      }

      return res.status(200).json({
        message: 'Empreinte faciale enregistrée avec succès (enrôlement initial)',
        user: result[0],
        enrolled: true
      });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
    }
  }

  // ─── PUT : Réinitialisation par Super-Admin UNIQUEMENT ───
  if (req.method === 'PUT') {
    const { admin_email, target_email, face_data } = req.body || {};
    if (!admin_email || !target_email) {
      return res.status(400).json({ message: 'admin_email et target_email requis' });
    }

    try {
      // Vérifier que l'appelant est Super-Admin
      const adminCheck = await sql`SELECT id, role FROM utilisateurs WHERE LOWER(email) = ${admin_email.toLowerCase().trim()}`;
      if (adminCheck.length === 0 || adminCheck[0].role !== 'Super-Admin') {
        return res.status(403).json({ message: '⛔ Seul le Super-Admin peut réinitialiser une empreinte faciale.' });
      }

      if (face_data) {
        // Réenrôler avec nouvelle face
        await sql`
          UPDATE utilisateurs 
          SET face_data = ${face_data}, face_enrolled_at = NOW()
          WHERE LOWER(email) = ${target_email.toLowerCase().trim()}
        `;
        return res.status(200).json({ message: 'Empreinte faciale réinitialisée par le Super-Admin.', enrolled: true });
      } else {
        // Supprimer l'empreinte (forcer un nouvel enrôlement)
        await sql`
          UPDATE utilisateurs 
          SET face_data = NULL, face_enrolled_at = NULL
          WHERE LOWER(email) = ${target_email.toLowerCase().trim()}
        `;
        return res.status(200).json({ message: 'Empreinte faciale supprimée. L\'utilisateur devra se réenrôler.', enrolled: false });
      }
    } catch (err) {
      return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
};
