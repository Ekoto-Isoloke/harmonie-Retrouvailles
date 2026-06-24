console.log('Démarrage du chargement des modules...');
require('dotenv').config();
console.log('dotenv chargé');
const express = require('express');
console.log('express chargé');
const cors = require('cors');
console.log('cors chargé');

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

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

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

// Routes Comptabilité
// Seul un comptable ou un Super-Admin peut enregistrer un paiement
app.post('/api/comptabilite/paiement', verifyToken, requireRole(['Comptable', 'Super-Admin']), paiementController.enregistrerPaiement);

// Lancement du serveur
app.listen(PORT, () => {
    console.log('Serveur demarre sur le port ' + PORT);
});
