const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens (à mettre dans un .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_a_changer';

/**
 * Middleware pour vérifier le JWT et extraire l'utilisateur
 */
const authenticateToken = (req, res, next) => {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            message: 'Token d\'authentification manquant'
        });
    }

    // Vérifier et décoder le token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Token invalide ou expiré'
            });
        }

        // Ajouter l'utilisateur décodé à la requête
        req.user = user;
        next();
    });
};

/**
 * Générer un JWT pour un utilisateur
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        JWT_SECRET,
        { expiresIn: '7d' } // Token valide 7 jours
    );
};

module.exports = {
    authenticateToken,
    generateToken,
    JWT_SECRET
};
