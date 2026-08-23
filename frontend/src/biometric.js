// biometric.js – handles WebAuthn registration for the dedicated page

(() => {
  const btnEnroll = document.getElementById('btn-enroll');
  const resultDiv = document.getElementById('result');

  // Helper: base64url <-> Uint8Array conversion
  const bufferToBase64Url = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  };

  const base64UrlToBuffer = (base64url) => {
    const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const buffer = new ArrayBuffer(raw.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < raw.length; ++i) view[i] = raw.charCodeAt(i);
    return buffer;
  };

  const showMessage = (html, isError = false) => {
    resultDiv.innerHTML = `<div class="${isError ? 'error' : 'success'}">${html}</div>`;
  };

  const register = async () => {
    btnEnroll.disabled = true;
    btnEnroll.textContent = 'Enregistrement...';
    try {
      // 1️⃣ Get registration options from backend
      const optResp = await fetch('/api/biometric/register-options', { method: 'GET', credentials: 'include' });
      if (!optResp.ok) throw new Error('Impossible d’obtenir les options d’enregistrement.');
      const options = await optResp.json();

      // 2️⃣ Prepare PublicKeyCredentialCreationOptions
      options.challenge = base64UrlToBuffer(options.challenge);
      if (options.user.id) options.user.id = base64UrlToBuffer(options.user.id);
      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map((c) => ({
          ...c,
          id: base64UrlToBuffer(c.id),
        }));
      }

      // 3️⃣ Call the native authenticator
      const credential = await navigator.credentials.create({ publicKey: options });
      if (!credential) throw new Error('Aucun credential créé.');

      // 4️⃣ Send attestation to server for verification
      const credentialResponse = {
        id: credential.id,
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: bufferToBase64Url(credential.response.attestationObject),
          clientDataJSON: bufferToBase64Url(credential.response.clientDataJSON),
        },
      };

      const verifyResp = await fetch('/api/biometric/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentialResponse),
      });
      if (!verifyResp.ok) throw new Error('Échec de la vérification serveur.');
      const verification = await verifyResp.json();

      // 5️⃣ Show success UI
      showMessage('✅ Empreinte enregistrée avec succès ! Vous pouvez maintenant vous connecter.', false);
    } catch (err) {
      console.error(err);
      showMessage(`❌ ${err.message}`, true);
    } finally {
      btnEnroll.disabled = false;
      btnEnroll.textContent = 'Enregistrer l\'empreinte';
    }
  };

  if (btnEnroll) btnEnroll.addEventListener('click', register);
})();
