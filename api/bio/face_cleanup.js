// api/bio/face_cleanup.js – Bulk facial data cleanup (Super‑Admin only)
// ---------------------------------------------------------------
// This endpoint allows a Super‑Admin to delete ALL stored face_data
// for every user *except* a whitelist of accounts (e.g. the main admin).
// It is useful when test accounts have leftover biometric data that
// must be purged before real users (DP, etc.) enroll their faces.
// ---------------------------------------------------------------

const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  // CORS headers (same as other API files)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { admin_email, whitelist } = req.body || {};
  if (!admin_email) {
    return res.status(400).json({ message: 'admin_email requis' });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return res.status(500).json({ message: 'DATABASE_URL manquant' });
  const sql = neon(dbUrl);

  try {
    // Verify super‑admin rights
    const adminCheck = await sql`
      SELECT id, role FROM utilisateurs WHERE LOWER(email) = ${admin_email.toLowerCase().trim()}`;
    if (adminCheck.length === 0 || adminCheck[0].role !== 'Super-Admin') {
      return res.status(403).json({ message: '⛔ Seul le Super‑Admin peut exécuter ce nettoyage.' });
    }

    // Build whitelist – always keep the admin who triggered the call
    const safeList = Array.isArray(whitelist) ? whitelist.map(e => e.toLowerCase().trim()) : [];
    safeList.push(admin_email.toLowerCase().trim());

    // Delete face_data for all users NOT in whitelist and that have a face stored
    const result = await sql`
      UPDATE utilisateurs
      SET face_data = NULL, face_enrolled_at = NULL
      WHERE LOWER(email) NOT IN (${sql(safeList)}) AND face_data IS NOT NULL`
      .then(r => r);

    // Neon returns rowCount for UPDATE via result.rowCount
    const deletedCount = result?.rowCount ?? 0;

    return res.status(200).json({
      message: 'Nettoyage terminé. Empreintes faciales supprimées.',
      deleted: deletedCount,
      whitelist: safeList
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
