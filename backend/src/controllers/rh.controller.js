const pool = require('../config/db'); // Fichier de config pg (supposé existant)

/**
 * Enregistrer l'heure d'arrivée d'un agent/enseignant
 */
exports.pointerArrivee = async (req, res) => {
    try {
        const { utilisateur_id, heure_arrivee, statut, motif } = req.body;

        // Calculer les minutes de retard par rapport à 07:30 (par exemple)
        const heureOfficielle = new Date(`1970-01-01T07:30:00Z`);
        const heureReelle = new Date(`1970-01-01T${heure_arrivee}Z`);

        let minutes_retard = 0;
        let finalStatut = statut || 'Présent';

        if (heureReelle > heureOfficielle) {
            minutes_retard = Math.floor((heureReelle - heureOfficielle) / 60000);
            if (minutes_retard > 0 && finalStatut === 'Présent') {
                finalStatut = 'En retard';
            }
        }

        const justification = motif ? 'En attente' : 'Non requis';

        const query = `
            INSERT INTO pointages_personnel 
            (utilisateur_id, heure_arrivee, minutes_retard, statut, motif, justification)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [utilisateur_id, heure_arrivee, minutes_retard, finalStatut, motif, justification];

        const { rows } = await pool.query(query, values);

        res.status(201).json({
            message: 'Pointage d\'arrivée enregistré avec succès',
            pointage: rows[0]
        });

    } catch (error) {
        console.error('Erreur lors du pointage :', error);
        if (error.code === '23505') { // Code d'erreur PostgreSQL pour violation de contrainte unique
            return res.status(400).json({ message: 'Un pointage existe déjà pour cet utilisateur aujourd\'hui.' });
        }
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

/**
 * Enregistrer l'heure de départ d'un agent/enseignant
 */
exports.pointerDepart = async (req, res) => {
    try {
        const { utilisateur_id, heure_depart } = req.body;
        const date_pointage = new Date().toISOString().split('T')[0]; // Date du jour YYYY-MM-DD

        const query = `
            UPDATE pointages_personnel 
            SET heure_depart = $1 
            WHERE utilisateur_id = $2 AND date_pointage = $3
            RETURNING *;
        `;
        const values = [heure_depart, utilisateur_id, date_pointage];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun pointage d\'arrivée trouvé pour aujourd\'hui.' });
        }

        res.status(200).json({
            message: 'Pointage de départ enregistré avec succès',
            pointage: rows[0]
        });

    } catch (error) {
        console.error('Erreur lors du pointage de départ :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
