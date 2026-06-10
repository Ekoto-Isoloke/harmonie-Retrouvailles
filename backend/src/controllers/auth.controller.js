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

        // For testing, we might want to bypass bcrypt if the password is just plain text,
        // but let's assume we use bcrypt.
        // const isMatch = await bcrypt.compare(password, user.mot_de_passe_hash);
        // If testing without hashed passwords in DB yet:
        const isMatch = password === user.mot_de_passe_hash || await bcrypt.compare(password, user.mot_de_passe_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const payload = {
            id: user.id,
            role: user.role,
            ecole_id: user.ecole_id,
            nom: user.nom,
            prenom: user.prenom
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_key', { expiresIn: '1d' });

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                ecole_id: user.ecole_id
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
