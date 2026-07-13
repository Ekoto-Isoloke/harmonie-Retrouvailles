const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Aucun token fourni.' });

    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(403).json({ message: 'Format de token invalide.' });

    jwt.verify(token, process.env.JWT_SECRET || 'supersecret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token non autorisé ou expiré.' });
        }
        req.user = decoded; // { id, role, ecole_id... }
        next();
    });
};

/**
 * Middleware pour vérifier si l'utilisateur possède un rôle spécifique
 * Ex: requireRole(['Super-Admin', 'Comptable'])
 */
exports.requireRole = (rolesAllowed) => {
    return (req, res, next) => {
        if (!req.user || !rolesAllowed.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès refusé : privilèges insuffisants.' });
        }
        next();
    };
};
