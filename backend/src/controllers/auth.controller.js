const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
        }

        const query = 'SELECT * FROM utilisateurs WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const user = rows[0];

        // Comparaison : On gère ici le texte brut (pour les comptes de test injectés manuellement) 
        // ou le bcrypt (pour les futurs comptes créés via l'API)
        let isMatch = false;
        if (user.password === password) {
            isMatch = true; // Mot de passe en clair (ex: comptes de test)
        } else {
            isMatch = await bcrypt.compare(password, user.password).catch(() => false); // Tentative avec bcrypt
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        if (user.statut !== 'Actif') {
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

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_key', { expiresIn: '1d' });

        res.json({
            message: 'Connexion réussie',
            token,
            user: payload
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
