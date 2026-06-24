const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require('@simplewebauthn/server');
const pool = require('../config/db');

// RP (Relying Party) Configuration
const rpName = 'Harmonie-Retrouvailles';
const rpID = 'localhost'; // Should be domain name in production
const origin = `http://${rpID}:5175`; // Frontend Vite dev server origin

exports.generateRegistrationOptions = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email est requis' });
    }

    // Get user from DB
    const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const user = rows[0];

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: String(user.id),
      userName: user.email,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    // Save challenge to DB
    await pool.query('UPDATE utilisateurs SET webauthn_challenge = $1 WHERE id = $2', [options.challenge, user.id]);

    res.json(options);
  } catch (error) {
    console.error('generateRegistrationOptions err:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.verifyRegistration = async (req, res) => {
  try {
    const { email, response } = req.body;

    // Get user
    const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const user = rows[0];

    const expectedChallenge = user.webauthn_challenge;

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified) {
      const { registrationInfo } = verification;
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      // Save credential
      await pool.query(
        `INSERT INTO webauthn_credentials (id, user_id, public_key, counter) 
         VALUES ($1, $2, $3, $4)`,
        [Buffer.from(credentialID).toString('base64url'), user.id, Buffer.from(credentialPublicKey), counter]
      );

      // Clear challenge
      await pool.query('UPDATE utilisateurs SET webauthn_challenge = NULL WHERE id = $1', [user.id]);

      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Vérification échouée' });
    }
  } catch (error) {
    console.error('verifyRegistration err:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.generateAuthenticationOptions = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email est requis' });
    }

    const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const user = rows[0];

    // Get credentials for this user
    const { rows: credentials } = await pool.query('SELECT * FROM webauthn_credentials WHERE user_id = $1', [user.id]);

    const allowCredentials = credentials.map(cred => ({
      id: Buffer.from(cred.id, 'base64url'),
      type: 'public-key',
    }));

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Save challenge
    await pool.query('UPDATE utilisateurs SET webauthn_challenge = $1 WHERE id = $2', [options.challenge, user.id]);

    res.json(options);
  } catch (error) {
    console.error('generateAuthenticationOptions err:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.verifyAuthenticationAndClockInOut = async (req, res) => {
  try {
    const { email, response } = req.body;

    const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const user = rows[0];
    const expectedChallenge = user.webauthn_challenge;

    const credentialIdStr = response.id;
    const { rows: credRows } = await pool.query('SELECT * FROM webauthn_credentials WHERE id = $1 AND user_id = $2', [credentialIdStr, user.id]);
    if (credRows.length === 0) {
      return res.status(404).json({ message: 'Empreinte non trouvée pour cet utilisateur' });
    }
    const credential = credRows[0];

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey: credential.public_key,
        credentialID: Buffer.from(credential.id, 'base64url'),
        counter: Number(credential.counter),
      },
    });

    if (verification.verified) {
      // Update counter
      await pool.query('UPDATE webauthn_credentials SET counter = $1 WHERE id = $2', [verification.authenticationInfo.newCounter, credential.id]);
      await pool.query('UPDATE utilisateurs SET webauthn_challenge = NULL WHERE id = $1', [user.id]);

      // Handle Pointage (Clock In/Out)
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

      let pointageAction = '';

      const { rows: pointages } = await pool.query('SELECT * FROM pointages_personnel WHERE utilisateur_id = $1 AND date_pointage = $2', [user.id, currentDate]);

      if (pointages.length === 0) {
        // Clock IN
        await pool.query(
          `INSERT INTO pointages_personnel (utilisateur_id, date_pointage, heure_arrivee, statut) 
           VALUES ($1, $2, $3, 'Présent')`,
          [user.id, currentDate, currentTime]
        );
        pointageAction = 'arrivee';
      } else {
        // Check if already clocked out
        if (pointages[0].heure_depart) {
          return res.status(400).json({ verified: true, message: "Départ déjà enregistré pour aujourd'hui.", action: 'already_done' });
        }
        // Clock OUT
        await pool.query(
          'UPDATE pointages_personnel SET heure_depart = $1 WHERE id = $2',
          [currentTime, pointages[0].id]
        );
        pointageAction = 'depart';
      }

      res.json({ verified: true, action: pointageAction, time: currentTime });
    } else {
      res.status(400).json({ verified: false, message: 'Vérification échouée' });
    }
  } catch (error) {
    console.error('verifyAuthenticationAndClockInOut err:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
