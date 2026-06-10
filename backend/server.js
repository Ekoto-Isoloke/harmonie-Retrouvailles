require('dotenv').config();
const express = require('express');
const cors = require('cors');

const rhController = require('./src/controllers/rh.controller');
const paiementController = require('./src/controllers/paiement.controller');
const authController = require('./src/controllers/auth.controller');
const { verifyToken, requireRole } = require('./src/middlewares/auth.middleware');

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

// Routes Ressources Humaines
app.post('/api/rh/pointage/arrivee', verifyToken, requireRole(['Agent', 'Enseignant', 'Admin', 'Super-Admin']), rhController.pointerArrivee);
app.post('/api/rh/pointage/depart', verifyToken, requireRole(['Agent', 'Enseignant', 'Admin', 'Super-Admin']), rhController.pointerDepart);

// Routes Comptabilité
// Seul un comptable ou un Super-Admin peut enregistrer un paiement
app.post('/api/comptabilite/paiement', verifyToken, requireRole(['Comptable', 'Super-Admin']), paiementController.enregistrerPaiement);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(\`Serveur démarré sur le port \${PORT}\`);
});
