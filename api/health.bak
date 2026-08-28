const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      return res.status(200).json({
        status: 'WARNING',
        message: 'API en ligne mais DATABASE_URL manquant dans Vercel Environment Variables.'
      });
    }

    const sql = neon(dbUrl);
    const result = await sql`SELECT NOW() as current_time, count(*)::int as total_users FROM utilisateurs`;

    return res.status(200).json({
      status: 'OK',
      message: 'API Harmonie-Retrouvailles 100% connectée à Neon PostgreSQL Cloud !',
      database_time: result[0].current_time,
      total_users: result[0].total_users,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Erreur Neon: ' + err.message
    });
  }
};
