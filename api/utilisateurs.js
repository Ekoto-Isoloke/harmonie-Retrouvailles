const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!dbUrl) {
    if (req.method === 'GET') return res.status(200).json({ source: 'local', users: [] });
    return res.status(200).json({ success: true, message: 'Stockage local (DATABASE_URL non configuré)' });
  }

  const sql = neon(dbUrl);

  try {
    // 1. Auto-migration de la table utilisateurs
    await sql`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255),
        mot_de_passe VARCHAR(255),
        role VARCHAR(100) NOT NULL,
        ecole VARCHAR(100) DEFAULT 'Harmonie-Retrouvailles',
        telephone VARCHAR(50),
        statut VARCHAR(50) DEFAULT 'Actif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Table du journal des activités (Live Feed & Signaux Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS activites_log (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        auteur VARCHAR(100),
        role VARCHAR(100),
        ecole VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Requête pour récupérer les activités récentes (Signaux live)
    if (req.method === 'GET' && (req.query.feed || req.query.activites)) {
      const activites = await sql`
        SELECT * FROM activites_log ORDER BY created_at DESC LIMIT 20
      `;
      return res.status(200).json(activites);
    }

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, nom, prenom, email, password, mot_de_passe, role, ecole, telephone, statut, created_at 
        FROM utilisateurs 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { nom, prenom, email, password, role, ecole, phone, telephone } = req.body || {};
      const cleanEmail = (email || '').toLowerCase().trim();
      const cleanNom = (nom || '').trim();
      const cleanPrenom = (prenom || '').trim();
      const cleanRole = role || 'Enseignant';
      const cleanEcole = ecole || 'Retrouvailles';
      const cleanPhone = phone || telephone || '';
      const rawPwd = password || '123456';

      if (!cleanEmail || !cleanNom) {
        return res.status(400).json({ message: 'Email et Nom obligatoires' });
      }

      // Insertion ou mise à jour de l'utilisateur
      const inserted = await sql`
        INSERT INTO utilisateurs (nom, prenom, email, password, mot_de_passe, role, ecole, telephone, statut)
        VALUES (${cleanNom}, ${cleanPrenom}, ${cleanEmail}, ${rawPwd}, ${rawPwd}, ${cleanRole}, ${cleanEcole}, ${cleanPhone}, 'Actif')
        ON CONFLICT (email) DO UPDATE SET
          nom = ${cleanNom},
          prenom = ${cleanPrenom},
          role = ${cleanRole},
          ecole = ${cleanEcole},
          telephone = ${cleanPhone},
          password = ${rawPwd},
          mot_de_passe = ${rawPwd}
        RETURNING id, nom, prenom, email, role, ecole, telephone, statut, created_at
      `;

      // Enregistrement de l'événement dans le Live Feed pour avertir l'administrateur
      const desc = `Le compte ${cleanRole} de ${cleanPrenom} ${cleanNom} (${cleanEcole}) a été créé et activé.`;
      await sql`
        INSERT INTO activites_log (type, titre, description, auteur, role, ecole)
        VALUES ('NOUVEAU_COMPTE', ${'Nouveau compte ' + cleanRole}, ${desc}, ${cleanPrenom + ' ' + cleanNom}, ${cleanRole}, ${cleanEcole})
      `;

      return res.status(201).json({
        message: 'Compte enregistré avec succès et signalé à la direction.',
        user: inserted[0]
      });
    }

    if (req.method === 'DELETE') {
      const email = req.query.email || req.body?.email;
      const id = req.query.id || req.body?.id;
      if (!email && !id) {
        return res.status(400).json({ message: 'Email ou ID requis' });
      }
      if (email) {
        await sql`DELETE FROM utilisateurs WHERE email = ${email.toLowerCase().trim()}`;
      } else if (id) {
        await sql`DELETE FROM utilisateurs WHERE id = ${id}`;
      }
      return res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API Utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
