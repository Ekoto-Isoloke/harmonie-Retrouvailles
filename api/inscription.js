const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    const data = req.body;
    
    // Extract parent details
    const emailParent = data.email_parent ? data.email_parent.toLowerCase().trim() : null;
    const telParent = data.tel_pere || data.tel_mere; // Using at least one phone
    const nomParent = data.nom_pere || data.nom_mere || 'Parent Inconnu';
    
    // 1. Find or create parent
    let parentId = null;
    let parentRow = null;

    if (emailParent || telParent) {
      // Try to find parent by email or phone
      const parents = await sql`
        SELECT id FROM utilisateurs 
        WHERE (email = ${emailParent} AND email IS NOT NULL AND email != '') 
           OR (telephone = ${telParent} AND telephone IS NOT NULL AND telephone != '')
        LIMIT 1
      `;
      
      if (parents.length > 0) {
        parentId = parents[0].id;
      } else {
        // Create new parent account
        // Default password: tel or 'parent123'
        const rawPassword = telParent || 'parent123';
        const role = 'Parent';
        
        const newParents = await sql`
          INSERT INTO utilisateurs (nom, email, mot_de_passe, role, ecole, telephone)
          VALUES (${nomParent}, ${emailParent}, ${rawPassword}, ${role}, ${data.ecole}, ${telParent})
          RETURNING id
        `;
        parentId = newParents[0].id;
      }
    }

    // 2. Generate Matricule
    const annee = new Date().getFullYear().toString().substring(2);
    const ecolePrefix = data.ecole === 'harmonie' ? 'HAR' : 'RET';
    const num = Math.floor(1000 + Math.random() * 9000);
    const matricule = data.type_inscription === 'reinscription' ? data.matricule : `${ecolePrefix}${annee}${num}`;

    // Auto-migration : créer la colonne photo_url si elle n'existe pas
    try {
      const colCheck = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'etudiants' AND column_name = 'photo_url'
      `;
      if (colCheck.length === 0) {
        await sql`ALTER TABLE etudiants ADD COLUMN photo_url TEXT`;
        console.log('Migration: colonne photo_url ajoutée à etudiants');
      }
    } catch (migErr) {
      console.error('Migration photo_url ignorée:', migErr.message);
    }

    // 3. Insert student
    const result = await sql`
      INSERT INTO etudiants (
        matricule, nom, postnom, prenom, sexe, date_naissance, lieu_naissance,
        nationalite, province_origine, adresse, ecole_provenance,
        classe, section, option_etude, ecole, type_inscription, parent_id, photo_url
      ) VALUES (
        ${matricule}, ${data.nom}, ${data.postnom}, ${data.prenom}, ${data.sexe},
        ${data.date_naissance || null}, ${data.lieu_naissance}, ${data.nationalite},
        ${data.province_origine}, ${data.adresse}, ${data.ecole_provenance},
        ${data.classe}, ${data.section || null}, ${data.option_etude || null},
        ${data.ecole}, ${data.type_inscription}, ${parentId}, ${data.photo_url || null}
      )
      RETURNING id, matricule
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Inscription validée avec succès.', 
      matricule: result[0].matricule,
      parent_id: parentId
    });

  } catch (err) {
    console.error('Erreur inscription:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur: ' + err.message });
  }
};
