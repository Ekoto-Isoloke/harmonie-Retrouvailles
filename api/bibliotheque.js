const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  // Si pas de DB connectée, répondre poliment pour que le frontend bascule en localStorage
  if (!dbUrl) {
    if (req.method === 'GET') return res.status(200).json({ source: 'local', documents: [] });
    return res.status(200).json({ success: true, warning: 'Sauvegarde locale uniquement' });
  }

  const sql = neon(dbUrl);

  try {
    // Auto-migration : créer la table si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS bibliotheque_documents (
        id VARCHAR(100) PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        auteur VARCHAR(100) DEFAULT 'Admin',
        categorie VARCHAR(100) DEFAULT 'Général',
        matiere VARCHAR(100) DEFAULT 'Divers',
        url TEXT NOT NULL,
        permissions VARCHAR(255) DEFAULT 'Tout le monde',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (req.method === 'GET') {
      const documents = await sql`
        SELECT * FROM bibliotheque_documents ORDER BY created_at DESC
      `;
      return res.status(200).json(documents);
    }

    if (req.method === 'POST') {
      const { id, titre, auteur, categorie, matiere, url, permissions } = req.body || {};
      if (!titre || !url) {
        return res.status(400).json({ message: 'Titre et fichier obligatoires' });
      }

      const docId = id || ('doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
      const docAuteur = auteur || 'Direction';
      const docCat = categorie || 'Manuel Scolaire';
      const docMat = matiere || 'Général';
      const docPerm = permissions || 'Tout le monde';

      await sql`
        INSERT INTO bibliotheque_documents (id, titre, auteur, categorie, matiere, url, permissions)
        VALUES (${docId}, ${titre}, ${docAuteur}, ${docCat}, ${docMat}, ${url}, ${docPerm})
        ON CONFLICT (id) DO UPDATE SET 
          titre = ${titre}, 
          auteur = ${docAuteur}, 
          categorie = ${docCat}, 
          matiere = ${docMat}, 
          url = ${url}, 
          permissions = ${docPerm}
      `;

      return res.status(201).json({
        success: true,
        document: { id: docId, titre, auteur: docAuteur, categorie: docCat, matiere: docMat, url, permissions: docPerm }
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) return res.status(400).json({ message: 'ID manquant' });

      await sql`
        DELETE FROM bibliotheque_documents WHERE id = ${id}
      `;
      return res.status(200).json({ success: true, message: 'Document supprimé' });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur API Bibliothèque:', err);
    return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
