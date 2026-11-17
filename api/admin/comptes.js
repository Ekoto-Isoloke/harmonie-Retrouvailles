const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });

  // Vérifier le token admin
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'Token requis.' });
  const token = authHeader.split(' ')[1];
  
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'harmonie_retrouvailles_jwt_2026');
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }

  const adminRoles = ['Super-Admin', 'Direction Générale', 'Direction', 'Admin'];
  if (!adminRoles.includes(decoded.role)) {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }

  const sql = neon(dbUrl);

  try {
    // GET — Lister les comptes en attente
    if (req.method === 'GET') {
      const statut = req.query.statut || 'en_attente';
      let rows;
      if (statut === 'tous') {
        rows = await sql`
          SELECT id, nom, prenom, email, role, ecole, telephone, statut, autre_poste, photo_profil, created_at 
          FROM utilisateurs 
          ORDER BY created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT id, nom, prenom, email, role, ecole, telephone, statut, autre_poste, photo_profil, created_at 
          FROM utilisateurs 
          WHERE statut = ${statut}
          ORDER BY created_at DESC
        `;
      }
      return res.status(200).json({ comptes: rows });
    }

    // PATCH — Approuver ou rejeter un compte
    if (req.method === 'PATCH') {
      const { id, action } = req.body || {};
      
      if (!id || !action) {
        return res.status(400).json({ message: 'ID et action requis.' });
      }

      if (action !== 'approuver' && action !== 'rejeter') {
        return res.status(400).json({ message: 'Action invalide. Utilisez "approuver" ou "rejeter".' });
      }

      const newStatut = action === 'approuver' ? 'Actif' : 'Rejeté';

      const rows = await sql`
        UPDATE utilisateurs 
        SET statut = ${newStatut} 
        WHERE id = ${id} 
        RETURNING id, nom, prenom, email, role, statut
      `;

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      const user = rows[0];
      const actionLabel = action === 'approuver' ? 'approuvé' : 'rejeté';

      // Enregistrer l'activité
      await sql`
        INSERT INTO activites_log (type, titre, description, auteur, role, ecole)
        VALUES (
          ${action === 'approuver' ? 'COMPTE_APPROUVE' : 'COMPTE_REJETE'},
          ${'Compte ' + actionLabel + ' : ' + user.prenom + ' ' + user.nom},
          ${'Le compte ' + user.role + ' de ' + user.prenom + ' ' + user.nom + ' a été ' + actionLabel + ' par ' + decoded.prenom + ' ' + decoded.nom + '.'},
          ${decoded.prenom + ' ' + decoded.nom},
          ${decoded.role},
          ${user.ecole || 'Harmonie-Retrouvailles'}
        )
      `;

      return res.status(200).json({
        message: `Compte de ${user.prenom} ${user.nom} ${actionLabel} avec succès.`,
        utilisateur: user
      });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API Admin Comptes:', error);
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
