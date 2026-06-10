const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');

/**
 * Enregistrer un paiement et générer un bordereau PDF avec QR Code
 */
exports.enregistrerPaiement = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { eleve_id, frais_scolaire_id, montant_paye, devise_paiement } = req.body;
        const caissier_id = req.user.id; // Supposé provenir d'un middleware JWT

        await client.query('BEGIN');

        // 1. Récupérer les détails des frais scolaires
        const fraisQuery = await client.query('SELECT * FROM frais_scolaires WHERE id = $1', [frais_scolaire_id]);
        if (fraisQuery.rows.length === 0) {
            throw new Error('Frais scolaire introuvable');
        }
        const frais = fraisQuery.rows[0];

        // 2. Récupérer les paiements précédents pour cet élève et ce frais
        const paiementsPrecedents = await client.query(
            'SELECT COALESCE(SUM(montant_paye), 0) as total_paye FROM paiements WHERE eleve_id = $1 AND frais_scolaire_id = $2',
            [eleve_id, frais_scolaire_id]
        );
        let totalDejaPaye = parseFloat(paiementsPrecedents.rows[0].total_paye);

        // 3. Gestion du taux de change si nécessaire
        let montant_converti = parseFloat(montant_paye);
        let taux_applique = null;

        if (devise_paiement !== frais.devise) {
            // Récupérer le taux de change
            const tauxQuery = await client.query('SELECT taux FROM taux_change WHERE devise_base = $1 AND devise_cible = $2 ORDER BY id DESC LIMIT 1', [frais.devise, devise_paiement]);
            if (tauxQuery.rows.length > 0) {
                taux_applique = parseFloat(tauxQuery.rows[0].taux);
                // Si frais en USD et paiement en CDF: montant_converti = montant_paye / taux
                if (frais.devise === 'USD' && devise_paiement === 'CDF') {
                    montant_converti = montant_paye / taux_applique;
                } else if (frais.devise === 'CDF' && devise_paiement === 'USD') {
                    montant_converti = montant_paye * taux_applique;
                }
            } else {
                throw new Error('Taux de change non configuré pour ces devises');
            }
        }

        // 4. Calculer le reste à payer
        const reste_a_payer = parseFloat(frais.montant) - (totalDejaPaye + montant_converti);
        const numero_transaction = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        // 5. Enregistrer le paiement
        const insertQuery = `
            INSERT INTO paiements 
            (numero_transaction, eleve_id, frais_scolaire_id, caissier_id, montant_paye, devise, taux_applique, reste_a_payer)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [numero_transaction, eleve_id, frais_scolaire_id, caissier_id, montant_paye, devise_paiement, taux_applique, reste_a_payer];
        const { rows } = await client.query(insertQuery, values);
        const paiement = rows[0];

        await client.query('COMMIT');

        // 6. Générer le QR Code
        const qrData = JSON.stringify({
            txn: numero_transaction,
            eleve: eleve_id,
            montant: \`\${montant_paye} \${devise_paiement}\`,
            date: paiement.date_paiement
        });
        const qrImageBase64 = await QRCode.toDataURL(qrData);

        // 7. Générer le PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', \`attachment; filename=bordereau-\${numero_transaction}.pdf\`);
        
        doc.pipe(res);

        // En-tête
        doc.fontSize(20).text('Plateforme Harmonie-Retrouvailles', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Bordereau de Paiement', { align: 'center', underline: true });
        doc.moveDown();

        // Détails
        doc.fontSize(12).text(\`Numéro de Transaction : \${numero_transaction}\`);
        doc.text(\`Date : \${new Date().toLocaleString()}\`);
        doc.text(\`Élève ID : \${eleve_id}\`);
        doc.text(\`Motif : \${frais.nom_frais}\`);
        doc.moveDown();
        
        doc.text(\`Montant Payé : \${montant_paye} \${devise_paiement}\`, { bold: true });
        if (taux_applique) {
            doc.text(\`Taux appliqué : \${taux_applique}\`);
        }
        doc.text(\`Reste à Payer : \${reste_a_payer.toFixed(2)} \${frais.devise}\`, { bold: true });
        doc.moveDown();

        // Ajouter le QR Code
        const qrBuffer = Buffer.from(qrImageBase64.split(',')[1], 'base64');
        doc.image(qrBuffer, 250, doc.y, { fit: [100, 100], align: 'center' });

        doc.end();

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur lors du paiement :', error);
        res.status(500).json({ message: error.message || 'Erreur serveur lors de l\\'enregistrement du paiement.' });
    } finally {
        client.release();
    }
};
