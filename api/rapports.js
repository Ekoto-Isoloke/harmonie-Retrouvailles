const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    return res.status(200).json([]);
  }

  const sql = neon(dbUrl);

  try {
    // Auto-migration : créer la table rapports_journaliers si inexistante dans Neon BD
    const tableCheck = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_name = 'rapports_journaliers'
    `;
    if (tableCheck.length === 0) {
      await sql`
        CREATE TABLE rapports_journaliers (
          id VARCHAR(100) PRIMARY KEY,
          ecole VARCHAR(50) NOT NULL,
          date VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'submitted',
          auteur JSONB,
          effectif_eleves JSONB,
          personnel_enseignants JSONB,
          activite_journaliere TEXT,
          ai_executive_summary TEXT,
          visiteurs JSONB,
          discipline_climat JSONB,
          directives_directeur TEXT,
          directives_promoteur TEXT,
          approved_by JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }

    // 1. GET : Récupérer les rapports officiels
    if (req.method === 'GET') {
      const ecole = req.query.ecole;
      let rows;
      if (ecole) {
        rows = await sql`
          SELECT * FROM rapports_journaliers 
          WHERE ecole = ${ecole} 
          ORDER BY date DESC, created_at DESC 
          LIMIT 100
        `;
      } else {
        rows = await sql`
          SELECT * FROM rapports_journaliers 
          ORDER BY date DESC, created_at DESC 
          LIMIT 100
        `;
      }

      const mapped = rows.map(r => ({
        id: r.id,
        ecole: r.ecole,
        date: r.date,
        status: r.status,
        auteur: r.auteur,
        effectifEleves: r.effectif_eleves,
        personnelEnseignants: r.personnel_enseignants,
        activiteJournaliere: r.activite_journaliere,
        aiExecutiveSummary: r.ai_executive_summary,
        visiteurs: r.visiteurs,
        disciplineClimat: r.discipline_climat,
        directivesDirecteur: r.directives_directeur,
        directivesPromoteur: r.directives_promoteur,
        approvedBy: r.approved_by,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));

      return res.status(200).json(mapped);
    }

    // 2. POST : Enregistrer, viser ou approuver un rapport
    if (req.method === 'POST') {
      const report = req.body || {};
      if (!report.id || !report.ecole || !report.date) {
        return res.status(400).json({ message: 'Données de rapport incomplètes (id, ecole, date requis).' });
      }

      await sql`
        INSERT INTO rapports_journaliers (
          id, ecole, date, status, auteur, effectif_eleves, personnel_enseignants,
          activite_journaliere, ai_executive_summary, visiteurs, discipline_climat,
          directives_directeur, directives_promoteur, approved_by, updated_at
        ) VALUES (
          ${report.id},
          ${report.ecole},
          ${report.date},
          ${report.status || 'submitted'},
          ${JSON.stringify(report.auteur || {})},
          ${JSON.stringify(report.effectifEleves || {})},
          ${JSON.stringify(report.personnelEnseignants || {})},
          ${report.activiteJournaliere || ''},
          ${report.aiExecutiveSummary || ''},
          ${JSON.stringify(report.visiteurs || [])},
          ${JSON.stringify(report.disciplineClimat || {})},
          ${report.directivesDirecteur || ''},
          ${report.directivesPromoteur || ''},
          ${JSON.stringify(report.approvedBy || null)},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          auteur = EXCLUDED.auteur,
          effectif_eleves = EXCLUDED.effectif_eleves,
          personnel_enseignants = EXCLUDED.personnel_enseignants,
          activite_journaliere = EXCLUDED.activite_journaliere,
          ai_executive_summary = EXCLUDED.ai_executive_summary,
          visiteurs = EXCLUDED.visiteurs,
          discipline_climat = EXCLUDED.discipline_climat,
          directives_directeur = EXCLUDED.directives_directeur,
          directives_promoteur = EXCLUDED.directives_promoteur,
          approved_by = EXCLUDED.approved_by,
          updated_at = CURRENT_TIMESTAMP
      `;

      return res.status(200).json({ success: true, message: 'Rapport sécurisé dans Neon BD.' });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur API Rapports:', err);
    return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
