const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
    }

    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      return res.status(500).json({ message: 'Configuration DATABASE_URL manquante sur Vercel.' });
    }

    const sql = neon(dbUrl);
    const rows = await sql`SELECT * FROM utilisateurs WHERE LOWER(email) = ${email.toLowerCase().trim()}`;

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants incorrects. Compte introuvable.' });
    }

    const user = rows[0];

    // Vérification du mot de passe
    if (user.password !== password) {
      return res.status(401).json({ message: 'Identifiants incorrects. Mot de passe erroné.' });
    }

    if (user.statut && user.statut !== 'Actif') {
      return res.status(403).json({ message: 'Ce compte est inactif ou en attente de validation.' });
    }

    const payload = {
      id: user.id,
      role: user.role,
      ecole: user.ecole,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'harmonie_retrouvailles_jwt_2026',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: payload
    });

  } catch (error) {
    console.error('Erreur API login:', error);
    return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};
