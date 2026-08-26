const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// CORS : autorise le domaine Vercel et localhost
app.use(cors({
    origin: ['https://harmonie-retrouvailles.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connexion PostgreSQL Neon via DATABASE_URL fourni par Vercel
const getPool = () => new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

// ============================================================
// ROUTES API
// ============================================================

// Santé
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API Harmonie-Retrouvailles en ligne !',
        db: process.env.DATABASE_URL ? 'Neon connecté' : 'Pas de DATABASE_URL',
        timestamp: new Date().toISOString()
    });
});

// ---- AUTHENTIFICATION ----
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
        }

        const pool = getPool();
        const { rows } = await pool.query(
            'SELECT * FROM utilisateurs WHERE LOWER(email) = $1',
            [email.toLowerCase().trim()]
        );
        await pool.end();

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Compte introuvable. Vérifiez votre email.' });
        }

        const user = rows[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        if (user.statut !== 'Actif') {
            return res.status(403).json({ message: 'Ce compte est inactif.' });
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

        return res.json({ message: 'Connexion réussie', token, user: payload });

    } catch (error) {
        console.error('Erreur login:', error.message);
        return res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

// ---- POINTAGES ----
app.post('/api/rh/pointage/arrivee', async (req, res) => {
    try {
        const { utilisateur_id, nom, role, ecole } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0];
        const pool = getPool();
        await pool.query(
            `INSERT INTO pointages (utilisateur_id, nom, role, ecole, date_pointage, heure_arrivee, statut)
             VALUES ($1, $2, $3, $4, $5, $6, 'Présent')`,
            [utilisateur_id, nom, role, ecole, today, now]
        );
        await pool.end();
        res.json({ message: 'Arrivée enregistrée.' });
    } catch (error) {
        console.error('Erreur pointage:', error.message);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

app.get('/api/rh/pointages', async (req, res) => {
    try {
        const pool = getPool();
        const { rows } = await pool.query(
            `SELECT * FROM pointages ORDER BY date_pointage DESC, heure_arrivee DESC LIMIT 200`
        );
        await pool.end();
        res.json(rows);
    } catch (error) {
        console.error('Erreur pointages:', error.message);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

// ---- UTILISATEURS ----
app.get('/api/utilisateurs', async (req, res) => {
    try {
        const pool = getPool();
        const { rows } = await pool.query(
            `SELECT id, nom, prenom, email, role, ecole, statut, created_at FROM utilisateurs ORDER BY created_at DESC`
        );
        await pool.end();
        res.json(rows);
    } catch (error) {
        console.error('Erreur utilisateurs:', error.message);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

app.post('/api/utilisateurs', async (req, res) => {
    try {
        const { nom, prenom, email, password, role, ecole } = req.body;
        const pool = getPool();
        const { rows } = await pool.query(
            `INSERT INTO utilisateurs (nom, prenom, email, password, role, ecole, statut)
             VALUES ($1, $2, $3, $4, $5, $6, 'Actif')
             ON CONFLICT (email) DO NOTHING
             RETURNING id, nom, prenom, email, role, ecole, statut`,
            [nom, prenom, email.toLowerCase().trim(), password, role, ecole]
        );
        await pool.end();
        if (rows.length === 0) {
            return res.status(409).json({ message: 'Un compte avec cet email existe déjà.' });
        }
        res.status(201).json({ message: 'Compte créé avec succès.', user: rows[0] });
    } catch (error) {
        console.error('Erreur création utilisateur:', error.message);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
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
        const pool = getPool();
        const { rows } = await pool.query(query, params);
        await pool.end();
        res.json(rows);
    } catch (error) {
        console.error('Erreur étudiants:', error.message);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

module.exports = app;
