console.log('Démarrage du chargement des modules...');
require('dotenv').config();
console.log('dotenv chargé');
const express = require('express');
console.log('express chargé');
const cors = require('cors');
console.log('cors chargé');
const path = require('path');

const rhController = require('./src/controllers/rh.controller');
console.log('rhController chargé');
const paiementController = require('./src/controllers/paiement.controller');
console.log('paiementController chargé');
const authController = require('./src/controllers/auth.controller');
console.log('authController chargé');
const biometricController = require('./src/controllers/biometric.controller');
console.log('biometricController chargé');
const { verifyToken, requireRole } = require('./src/middlewares/auth.middleware');
console.log('middlewares chargés');
const pool = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Serve the built frontend (dist) as static assets
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ----- Routes API -----

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'API Harmonie-Retrouvailles en ligne !' });
});

// Routes d'authentification
app.post('/api/auth/login', authController.login);

// Routes Biométrie WebAuthn
app.get('/api/biometrics/register-options', biometricController.generateRegistrationOptions);
app.post('/api/biometrics/register-verify', biometricController.verifyRegistration);
app.get('/api/biometrics/auth-options', biometricController.generateAuthenticationOptions);
app.post('/api/biometrics/auth-verify', biometricController.verifyAuthenticationAndClockInOut);

// Routes Ressources Humaines
app.post('/api/rh/pointage/arrivee', verifyToken, requireRole(['Agent', 'Enseignant', 'Admin', 'Super-Admin']), rhController.pointerArrivee);
app.post('/api/rh/pointage/depart', verifyToken, requireRole(['Agent', 'Enseignant', 'Admin', 'Super-Admin']), rhController.pointerDepart);

// Report generation endpoint (PDF/DOCX)
const reportService = require('./src/services/report.service');
app.get('/api/rh/pointage/report', verifyToken, requireRole(['Direction Générale', 'Super-Admin', 'Admin']), async (req, res) => {
    const format = (req.query.format || 'pdf').toLowerCase();
    try {
        const { rows } = await pool.query(`SELECT * FROM pointages_personnel WHERE date_pointage = CURRENT_DATE`);
        if (format === 'docx') {
            await reportService.generateDocx(rows, res);
        } else {
            await reportService.generatePdf(rows, res);
        }
    } catch (err) {
        console.error("Erreur génération rapport:", err);
        res.status(500).json({ message: "Erreur lors de la génération du rapport" });
    }
});

// Routes Comptabilité
// Seul un comptable ou un Super-Admin peut enregistrer un paiement
app.post('/api/comptabilite/paiement', verifyToken, requireRole(['Comptable', 'Super-Admin']), paiementController.enregistrerPaiement);

// Fallback for SPA routes – serve index.html for any non-API request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Serveur demarre sur le port ${PORT}`);
    });
}
module.exports = app;
