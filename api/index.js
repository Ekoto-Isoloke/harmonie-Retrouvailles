const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

// ============================================================
// ROUTES API
// ============================================================

// Route de test santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'API Harmonie-Retrouvailles en ligne !', timestamp: new Date().toISOString() });
});

// ---- AUTHENTIFICATION ----
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
        }

        const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email.toLowerCase().trim()]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Identifiants incorrects. Compte introuvable.' });
        }

        const user = rows[0];

        // Vérification du mot de passe (supporte texte brut pour les comptes de test)
        const isMatch = (user.password === password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects. Mot de passe erroné.' });
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

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'harmonie_retrouvailles_jwt_2026',
            { expiresIn: '1d' }
        );

        res.json({ message: 'Connexion réussie', token, user: payload });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
});

// ---- POINTAGE / PRÉSENCE ----
app.post('/api/rh/pointage/arrivee', async (req, res) => {
    try {
        const { utilisateur_id, nom, role, ecole } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0];

        await pool.query(
            `INSERT INTO pointages (utilisateur_id, nom, role, ecole, date_pointage, heure_arrivee, statut)
             VALUES ($1, $2, $3, $4, $5, $6, 'Présent')
             ON CONFLICT DO NOTHING`,
            [utilisateur_id, nom, role, ecole, today, now]
        );

        res.json({ message: 'Arrivée enregistrée avec succès.' });
    } catch (error) {
        console.error('Erreur pointage arrivée:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

app.post('/api/rh/pointage/depart', async (req, res) => {
    try {
        const { utilisateur_id } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0];

        await pool.query(
            `UPDATE pointages SET heure_depart = $1 WHERE utilisateur_id = $2 AND date_pointage = $3`,
            [now, utilisateur_id, today]
        );

        res.json({ message: 'Départ enregistré avec succès.' });
    } catch (error) {
        console.error('Erreur pointage départ:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

app.get('/api/rh/pointages', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM pointages ORDER BY date_pointage DESC, heure_arrivee DESC LIMIT 100`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur récupération pointages:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// ---- UTILISATEURS ----
app.get('/api/utilisateurs', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, nom, prenom, email, role, ecole, statut, created_at FROM utilisateurs ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur récupération utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

app.post('/api/utilisateurs', async (req, res) => {
    try {
        const { nom, prenom, email, password, role, ecole } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO utilisateurs (nom, prenom, email, password, role, ecole, statut)
             VALUES ($1, $2, $3, $4, $5, $6, 'Actif')
             ON CONFLICT (email) DO NOTHING
             RETURNING id, nom, prenom, email, role, ecole, statut`,
            [nom, prenom, email.toLowerCase().trim(), password, role, ecole]
        );

        if (rows.length === 0) {
            return res.status(409).json({ message: 'Un compte avec cet email existe déjà.' });
        }

        res.status(201).json({ message: 'Compte créé avec succès.', user: rows[0] });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// ---- ÉTUDIANTS ----
app.get('/api/etudiants', async (req, res) => {
    try {
        const { ecole, classe, section, option_etude } = req.query;
        let query = `SELECT * FROM etudiants WHERE 1=1`;
        const params = [];

        if (ecole) { params.push(ecole); query += ` AND ecole = $${params.length}`; }
        if (classe) { params.push(classe); query += ` AND classe = $${params.length}`; }
        if (section) { params.push(section); query += ` AND section = $${params.length}`; }
        if (option_etude) { params.push(option_etude); query += ` AND option_etude = $${params.length}`; }

        query += ` ORDER BY nom ASC`;
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erreur récupération étudiants:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = app;
