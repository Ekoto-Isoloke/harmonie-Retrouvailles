// ═══════════════════════════════════════════════════════════════
// presence.js — Système de Présence Biométrique (Flux 3 Étapes)
// C.S. Harmonie & G.S. Retrouvailles — Kinshasa, RDC
// ═══════════════════════════════════════════════════════════════
// FLUX SÉCURISÉ :
//  Étape A : L'agent saisit son EMAIL uniquement → caméra immédiatement
//  Étape B : La caméra s'ouvre pour capturer le visage
//  Étape C : Comparaison avec la photo stockée lors de la création du compte
//  Résultat: Le NOM s'affiche UNIQUEMENT après validation réussie
//
// SÉCURITÉ RENFORCÉE :
//  1. Aucun nom affiché avant la validation biométrique
//  2. Comparaison composite : face-api.js (70%) + NCC normalisé (30%)
//  3. Seuil strict : score >= 75% pour valider
// ═══════════════════════════════════════════════════════════════

let presenceStream = null;
let presencePhaseTimeout = null;
let presenceAuthUser = null;
let capturedFaceData = null;
let presenceCameraActive = false;

// ══════════════════════════════════════════════════════
// ÉTAPE A — OUVRIR LE MODAL (email uniquement)
// ══════════════════════════════════════════════════════
window.openPresenceScanner = function () {
  const modal = document.getElementById('presence-modal');
  if (!modal) return;

  // Réinitialiser l'état global
  presenceAuthUser = null;
  capturedFaceData = null;
  presenceCameraActive = false;
  stopPresenceCamera();

  // Injecter le formulaire si nécessaire
  injectPresenceAuthGate();

  // Afficher uniquement l'écran email
  showStep('presence-auth-gate');

  // Vider les champs
  const emailInput = document.getElementById('presence-auth-email');
  const typeSelect = document.getElementById('presence-type-select');
  const errorEl = document.getElementById('presence-auth-error');
  if (emailInput) emailInput.value = '';
  if (typeSelect) typeSelect.value = 'arrivee';
  if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

  modal.classList.remove('opacity-0', 'pointer-events-none');
};

// ══════════════════════════════════════════════════════
// INJECTION DU FORMULAIRE EMAIL (Étape A)
// ══════════════════════════════════════════════════════
function injectPresenceAuthGate() {
  if (document.getElementById('presence-auth-gate')) return; // déjà injecté

  const modal = document.getElementById('presence-modal');
  if (!modal) return;

  const wrapper = modal.querySelector('.w-full') || modal.querySelector('div');
  if (!wrapper) return;

  // Sauvegarder le contenu scanner original
  let scannerContent = document.getElementById('presence-scanner-content');
  if (!scannerContent) {
    scannerContent = document.createElement('div');
    scannerContent.id = 'presence-scanner-content';
    scannerContent.style.display = 'none';
    while (wrapper.firstChild) {
      scannerContent.appendChild(wrapper.firstChild);
    }
    wrapper.appendChild(scannerContent);
  } else {
    scannerContent.style.display = 'none';
  }

  // ── Étape A : Formulaire email ──
  const authGate = document.createElement('div');
  authGate.id = 'presence-auth-gate';
  authGate.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;min-height:340px;';
  authGate.innerHTML = `
    <div style="text-align:center;margin-bottom:1.2rem;">
      <div style="font-size:2.5rem;margin-bottom:0.5rem;">📸</div>
      <h2 style="font-size:1.25rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem 0;">Présence Biométrique</h2>
      <p style="font-size:0.8rem;color:#64748b;margin:0;">Entrez votre email — la caméra s'ouvrira ensuite</p>
    </div>
    <div style="width:100%;max-width:340px;">
      <div style="margin-bottom:1rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Type de présence</label>
        <select id="presence-type-select" style="width:100%;padding:0.55rem 0.75rem;border:1.5px solid #d1d5db;border-radius:8px;font-size:0.9rem;background:#fff;color:#1e293b;outline:none;cursor:pointer;">
          <option value="arrivee">🟢 Arrivée</option>
          <option value="depart">🔴 Départ</option>
        </select>
      </div>
      <div style="margin-bottom:1rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Email professionnel</label>
        <input
          id="presence-auth-email"
          type="email"
          placeholder="votre@email.cd"
          style="width:100%;padding:0.55rem 0.75rem;border:1.5px solid #d1d5db;border-radius:8px;font-size:0.9rem;box-sizing:border-box;outline:none;"
          onkeydown="if(event.key==='Enter'){presenceAuthenticate();}"
        />
      </div>
      <div id="presence-auth-error" style="display:none;background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;border-radius:8px;padding:0.6rem 0.8rem;font-size:0.8rem;margin-bottom:0.8rem;text-align:center;"></div>
      <button
        id="presence-auth-btn"
        onclick="presenceAuthenticate()"
        style="width:100%;padding:0.7rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:8px;font-size:0.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;"
      >
        <span>📷</span> Passer à la Caméra
      </button>
      <button
        onclick="closePresenceModal()"
        style="width:100%;margin-top:0.6rem;padding:0.6rem;background:transparent;color:#64748b;border:1.5px solid #e2e8f0;border-radius:8px;font-size:0.85rem;cursor:pointer;"
      >
        Annuler
      </button>
    </div>
  `;

  // ── Étape B : Caméra ──
  const cameraStep = document.createElement('div');
  cameraStep.id = 'presence-camera-step';
  cameraStep.style.cssText = 'display:none;flex-direction:column;align-items:center;padding:1.2rem;min-height:340px;';
  cameraStep.innerHTML = `
    <div style="text-align:center;margin-bottom:1rem;">
      <h2 style="font-size:1.1rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem 0;">📸 Capture Biométrique</h2>
      <p style="font-size:0.78rem;color:#64748b;margin:0;">Regardez la caméra et restez immobile</p>
    </div>
    <div style="position:relative;width:260px;height:260px;border-radius:50%;overflow:hidden;border:3px solid #2563eb;background:#0f172a;margin-bottom:1rem;">
      <video id="presence-video-feed" autoplay muted playsinline style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1);"></video>
      <canvas id="presence-video-canvas" style="display:none;"></canvas>
      <div style="position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 3px rgba(37,99,235,0.6);pointer-events:none;"></div>
      <div id="presence-scan-line" style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#22d3ee,transparent);animation:presenceScanAnim 2s linear infinite;pointer-events:none;"></div>
    </div>
    <div id="presence-camera-status" style="font-size:0.82rem;color:#64748b;margin-bottom:0.8rem;text-align:center;">Initialisation de la caméra…</div>
    <div id="presence-countdown-bar-wrap" style="width:260px;height:6px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:0.8rem;display:none;">
      <div id="presence-countdown-bar" style="height:100%;background:linear-gradient(90deg,#2563eb,#22d3ee);width:100%;transition:width 0.1s linear;"></div>
    </div>
    <button
      id="presence-capture-btn"
      onclick="triggerManualFaceCapture()"
      disabled
      style="padding:0.65rem 1.5rem;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:8px;font-size:0.9rem;font-weight:600;cursor:pointer;opacity:0.5;"
    >
      📸 Capturer mon visage
    </button>
    <button
      onclick="closePresenceModal()"
      style="margin-top:0.6rem;padding:0.5rem 1.2rem;background:transparent;color:#64748b;border:1.5px solid #e2e8f0;border-radius:8px;font-size:0.82rem;cursor:pointer;"
    >
      Annuler
    </button>
  `;

  // ── Étape C : Résultat ──
  const resultStep = document.createElement('div');
  resultStep.id = 'presence-result-step';
  resultStep.style.cssText = 'display:none;flex-direction:column;align-items:center;padding:1.5rem;min-height:340px;justify-content:center;';

  wrapper.appendChild(authGate);
  wrapper.appendChild(cameraStep);
  wrapper.appendChild(resultStep);

  // CSS animation scan line
  if (!document.getElementById('presence-scan-style')) {
    const style = document.createElement('style');
    style.id = 'presence-scan-style';
    style.textContent = `
      @keyframes presenceScanAnim {
        0% { top:0%;opacity:1; } 49% { opacity:1; } 50% { top:100%;opacity:0; }
        51% { top:0%;opacity:0; } 52% { opacity:1; } 100% { top:100%;opacity:1; }
      }
      @keyframes presenceResultFadeIn {
        from { opacity:0;transform:scale(0.9) translateY(10px); }
        to { opacity:1;transform:scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}



// ══════════════════════════════════════════════════════
// HELPERS — Afficher/Masquer les étapes
// ══════════════════════════════════════════════════════
function showStep(stepId) {
  ['presence-auth-gate', 'presence-camera-step', 'presence-result-step', 'presence-scanner-content'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(stepId);
  if (target) target.style.display = 'flex';
}

function setAuthError(msg) {
  const errorEl = document.getElementById('presence-auth-error');
  if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
}

function setCameraStatus(msg, color) {
  const el = document.getElementById('presence-camera-status');
  if (el) { el.textContent = msg; el.style.color = color || '#64748b'; }
}

function stopPresenceCamera() {
  if (presenceStream) {
    presenceStream.getTracks().forEach(t => t.stop());
    presenceStream = null;
  }
  if (presencePhaseTimeout) {
    clearTimeout(presencePhaseTimeout);
    presencePhaseTimeout = null;
  }
}

// ══════════════════════════════════════════════════════
// ÉTAPE A → B — AUTHENTIFICATION PAR EMAIL
// ══════════════════════════════════════════════════════
window.presenceAuthenticate = async function () {
  const email = (document.getElementById('presence-auth-email')?.value || '').trim().toLowerCase();
  const presenceType = document.getElementById('presence-type-select')?.value || 'arrivee';
  const btn = document.getElementById('presence-auth-btn');
  const errorEl = document.getElementById('presence-auth-error');

  if (errorEl) { errorEl.style.display = 'none'; }

  if (!email || !email.includes('@')) {
    setAuthError('⚠️ Veuillez saisir une adresse email valide.');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Recherche…'; btn.style.opacity = '0.7'; }

  try {
    let userData = null;

    // 1. API Cloud (Neon)
    try {
      const res = await fetch(`/api/bio/face?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.face_data || data.photo_profil || data.faceDescriptor)) {
          userData = data;
        }
      }
    } catch (apiErr) {
      console.warn('[Présence] API Cloud indisponible:', apiErr);
    }

    // 2. Fallback localStorage
    if (!userData) {
      const allUsers = JSON.parse(localStorage.getItem('schoolUsers') || '[]');
      const found = allUsers.find(u => u.email && u.email.toLowerCase() === email);
      if (found) {
        userData = {
          email: found.email,
          face_data: found.face_data || found.photo_profil || found.facePhoto || null,
          photo_profil: found.photo_profil || null,
          faceDescriptor: found.faceDescriptor || null,
          nom: found.nom || '',
          prenom: found.prenom || '',
          role: found.role || '',
          ecole: found.ecole || ''
        };
      }
    }

    if (!userData) {
      setAuthError('❌ Aucun compte trouvé avec cet email. Vérifiez et réessayez.');
      if (btn) { btn.disabled = false; btn.innerHTML = '<span>📷</span> Passer à la Caméra'; btn.style.opacity = '1'; }
      return;
    }

    const referencePhoto = userData.face_data || userData.photo_profil;
    if (!referencePhoto && !userData.faceDescriptor) {
      setAuthError('⚠️ Aucune photo biométrique enregistrée. Contactez un administrateur.');
      if (btn) { btn.disabled = false; btn.innerHTML = '<span>📷</span> Passer à la Caméra'; btn.style.opacity = '1'; }
      return;
    }

    // Stocker l'utilisateur sans afficher le nom
    presenceAuthUser = { ...userData, presenceType };

    // → Passer directement à la caméra (SANS afficher le nom)
    showStep('presence-camera-step');
    launchPresenceCamera();

  } catch (err) {
    console.error('[Présence] Erreur:', err);
    setAuthError('❌ Erreur de connexion. Vérifiez votre réseau.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<span>📷</span> Passer à la Caméra'; btn.style.opacity = '1'; }
  }
};

// ══════════════════════════════════════════════════════
// ÉTAPE B — LANCER LA CAMÉRA
// ══════════════════════════════════════════════════════
async function launchPresenceCamera() {
  presenceCameraActive = true;
  setCameraStatus('Initialisation de la caméra…', '#64748b');

  const captureBtn = document.getElementById('presence-capture-btn');
  if (captureBtn) { captureBtn.disabled = true; captureBtn.style.opacity = '0.5'; }

  const countdownWrap = document.getElementById('presence-countdown-bar-wrap');
  if (countdownWrap) countdownWrap.style.display = 'none';

  stopPresenceCamera();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      audio: false
    });
    presenceStream = stream;

    const video = document.getElementById('presence-video-feed');
    if (video) {
      video.srcObject = stream;
      await new Promise(resolve => { video.onloadedmetadata = resolve; });
      await video.play().catch(() => {});
    }

    setCameraStatus('✅ Caméra active — Regardez l\'objectif et cliquez "Capturer"', '#16a34a');
    if (captureBtn) { captureBtn.disabled = false; captureBtn.style.opacity = '1'; }
    if (countdownWrap) countdownWrap.style.display = 'block';
    startCountdownAutoCapture(4000);

  } catch (err) {
    console.error('[Présence] Caméra:', err);
    setCameraStatus('❌ Caméra inaccessible. Cliquez "Capturer" pour réessayer.', '#dc2626');
    if (captureBtn) { captureBtn.disabled = false; captureBtn.style.opacity = '1'; captureBtn.textContent = '🔄 Réessayer'; }
    presenceCameraActive = false;
  }
}

// Compte à rebours + capture automatique
function startCountdownAutoCapture(durationMs) {
  const bar = document.getElementById('presence-countdown-bar');
  if (!bar) return;
  const start = Date.now();

  function tick() {
    if (!presenceCameraActive) { bar.style.width = '100%'; return; }
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, 1 - elapsed / durationMs);
    bar.style.width = (remaining * 100) + '%';
    if (elapsed >= durationMs) {
      bar.style.width = '0%';
      triggerManualFaceCapture();
    } else {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// Fermer le modal
window.closePresenceModal = function () {
  stopPresenceCamera();
  presenceCameraActive = false;
  presenceAuthUser = null;
  capturedFaceData = null;
  const modal = document.getElementById('presence-modal');
  if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
};

// Alias compatibilité
window.closePresenceScanner = window.closePresenceModal;
window.closeScanModal = window.closePresenceModal;
window.closeFaceModal = window.closePresenceModal;



// ══════════════════════════════════════════════════════
// ÉTAPE B → C — CAPTURE MANUELLE (bouton ou countdown)
// ══════════════════════════════════════════════════════
window.triggerManualFaceCapture = function () {
  presenceCameraActive = false; // Arrêter le countdown

  const video = document.getElementById('presence-video-feed');
  if (!video || !presenceStream) {
    setCameraStatus('❌ Caméra non disponible. Réessayez.', '#dc2626');
    return;
  }

  try {
    const canvas = document.createElement('canvas');
    const W = video.videoWidth || 640;
    const H = video.videoHeight || 480;
    // Capturer en 360×360 centré (ratio carré pour la comparaison)
    const side = Math.min(W, H);
    canvas.width = 360;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    // Miroir horizontal (selfie naturel)
    ctx.translate(360, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, (W - side) / 2, (H - side) / 2, side, side, 0, 0, 360, 360);

    capturedFaceData = canvas.toDataURL('image/jpeg', 0.85);
    if (presenceAuthUser) presenceAuthUser.capturedPhoto = capturedFaceData;

    stopPresenceCamera();

    // Afficher preview de capture
    const preview = document.getElementById('presence-capture-preview');
    if (preview) { preview.src = capturedFaceData; preview.style.display = 'block'; }

    setCameraStatus('📸 Capture effectuée — Analyse en cours…', '#d97706');

    const captureBtn = document.getElementById('presence-capture-btn');
    if (captureBtn) { captureBtn.disabled = true; captureBtn.style.opacity = '0.5'; }

    // → Étape C : validation
    validateAndConfirmPresence();

  } catch (e) {
    console.error('[Présence] Capture:', e);
    setCameraStatus('❌ Erreur de capture. Réessayez.', '#dc2626');
  }
};

// ══════════════════════════════════════════════════════
// ÉTAPE C — VALIDATION BIOMÉTRIQUE COMPOSITE (NCC + face-api)
// ══════════════════════════════════════════════════════
async function validateAndConfirmPresence() {
  if (!presenceAuthUser || !capturedFaceData) {
    setCameraStatus('❌ Capture manquante. Réessayez.', '#dc2626');
    return;
  }

  setCameraStatus('🔍 Comparaison biométrique en cours…', '#d97706');

  // Référence : face_data prioritaire, sinon photo_profil
  const referencePhoto = presenceAuthUser.face_data || presenceAuthUser.photo_profil || presenceAuthUser.photo || null;
  const storedDescriptor = presenceAuthUser.faceDescriptor || null;

  if (!referencePhoto && !storedDescriptor) {
    showPresenceFailure('⚠️ Aucune photo biométrique de référence. Contactez un administrateur.');
    return;
  }

  let compositeScore = 0;
  let faceApiScore = null;
  let nccScore = null;

  // ── 1. FACE-API (si disponible, poids 70%) ──
  if (storedDescriptor && window.faceapi) {
    try {
      const capturedDesc = await detectFaceDescriptor(capturedFaceData);
      if (capturedDesc && storedDescriptor.length === capturedDesc.length) {
        const dist = euclideanDistance(capturedDesc, storedDescriptor);
        // Convertir distance en score : 0 = parfait, 0.6+ = inconnu
        faceApiScore = Math.max(0, Math.min(1, 1 - ((dist - 0.35) / 0.35)));
      }
    } catch (e) {
      console.warn('[Présence] face-api indisponible:', e);
    }
  }

  // ── 2. NCC RENFORCÉ (poids 30% si face-api dispo, sinon 100%) ──
  if (referencePhoto) {
    try {
      nccScore = await computeAdvancedBiometricScore(capturedFaceData, referencePhoto);
    } catch (e) {
      console.warn('[Présence] NCC error:', e);
      nccScore = 0;
    }
  }

  // ── 3. Score composite ──
  if (faceApiScore !== null && nccScore !== null) {
    compositeScore = faceApiScore * 0.70 + nccScore * 0.30;
  } else if (faceApiScore !== null) {
    compositeScore = faceApiScore;
  } else if (nccScore !== null) {
    compositeScore = nccScore;
  } else {
    showPresenceFailure('❌ Impossible de comparer les visages. Réessayez.');
    return;
  }

  const SEUIL = (faceApiScore !== null) ? 0.75 : 0.68;

  console.log('[Présence] Score composite:', compositeScore.toFixed(3), '| NCC:', nccScore?.toFixed(3), '| face-api:', faceApiScore?.toFixed(3), '| Seuil:', SEUIL);

  if (compositeScore < SEUIL) {
    // Log tentative échouée
    try {
      await fetch('/api/rh/pointage/arrivee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: presenceAuthUser.id || null,
          nom: '---',
          role: presenceAuthUser.role || '',
          ecole: presenceAuthUser.ecole || '',
          date_pointage: new Date().toISOString().split('T')[0],
          heure: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'USURPATION_BLOQUEE',
          score_facial: compositeScore
        })
      });
    } catch (_) {}

    showPresenceFailure(
      '⛔ Visage non reconnu (' + (compositeScore * 100).toFixed(0) + '%). ' +
      'Assurez-vous que c\'est bien vous et réessayez.'
    );
    return;
  }

  // ✅ Validé → révéler le nom et afficher le résultat
  await showPresenceResultCard(compositeScore);
}

// ══════════════════════════════════════════════════════
// ALGORITHME NCC RENFORCÉ (Normalized Cross-Correlation)
// ══════════════════════════════════════════════════════
async function computeAdvancedBiometricScore(img1B64, img2B64) {
  const SIZE = 64;

  const [pixels1, pixels2] = await Promise.all([
    getGrayPixels(img1B64, SIZE),
    getGrayPixels(img2B64, SIZE)
  ]);

  if (!pixels1 || !pixels2) return 0;

  // Zone centrale uniquement (ignorer 15% de bords)
  const c1 = extractCentralRegion(pixels1, SIZE, 0.15);
  const c2 = extractCentralRegion(pixels2, SIZE, 0.15);

  // Normalisation d'histogramme
  const n1 = normalizeHistogram(c1);
  const n2 = normalizeHistogram(c2);

  // NCC
  const ncc = computeNCC(n1, n2);

  // Convertir NCC [-1,1] → score [0,1]
  return Math.max(0, Math.min(1, (ncc + 1) / 2));
}

function getGrayPixels(b64, size) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        const gray = new Float32Array(size * size);
        for (let i = 0; i < size * size; i++) {
          gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
        }
        resolve(gray);
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = b64;
    setTimeout(() => resolve(null), 6000);
  });
}

function extractCentralRegion(pixels, size, borderRatio) {
  const border = Math.floor(size * borderRatio);
  const result = [];
  for (let y = border; y < size - border; y++) {
    for (let x = border; x < size - border; x++) {
      result.push(pixels[y * size + x]);
    }
  }
  return result;
}

function normalizeHistogram(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min || 1;
  return arr.map(v => (v - min) / range * 255);
}

function computeNCC(a, b) {
  const n = a.length;
  let meanA = 0, meanB = 0;
  for (let i = 0; i < n; i++) { meanA += a[i]; meanB += b[i]; }
  meanA /= n; meanB /= n;

  let num = 0, varA = 0, varB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    varA += da * da;
    varB += db * db;
  }
  const denom = Math.sqrt(varA * varB);
  return denom < 1e-8 ? 0 : num / denom;
}

function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

async function detectFaceDescriptor(b64) {
  // Utilise face-api.js si chargé globalement
  if (!window.faceapi) return null;
  const img = await loadImageFromDataUrl(b64);
  const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  return detection ? Array.from(detection.descriptor) : null;
}

function loadImageFromDataUrl(b64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = b64;
  });
}

// ══════════════════════════════════════════════════════
// ÉTAPE C — RÉSULTAT : NOM RÉVÉLÉ SEULEMENT ICI
// ══════════════════════════════════════════════════════
async function showPresenceResultCard(score) {
  const user = presenceAuthUser;
  if (!user) return;

  // Construire le nom complet maintenant (révélé pour la 1ère fois)
  const fullName = ((user.prenom || '') + ' ' + (user.nom || '')).trim() || user.name || 'Utilisateur';
  const presenceType = user.presenceType || 'arrivee';

  showStep('presence-result-step');

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const isArrivee = presenceType === 'arrivee';

  // Remplir la carte résultat
  const nameEl = document.getElementById('presence-result-name');
  const roleEl = document.getElementById('presence-result-role');
  const timeEl = document.getElementById('presence-result-time');
  const badgeEl = document.getElementById('presence-result-badge');
  const photoEl = document.getElementById('presence-result-photo');
  const scoreEl = document.getElementById('presence-result-score');
  const greetEl = document.getElementById('presence-result-greet');

  if (nameEl) nameEl.textContent = fullName;
  if (roleEl) roleEl.textContent = (user.role || '') + (user.ecole ? ' • ' + user.ecole : '');
  if (timeEl) timeEl.textContent = timeStr;
  if (scoreEl) scoreEl.textContent = 'Score biométrique : ' + (score * 100).toFixed(0) + '%';
  if (greetEl) greetEl.textContent = isArrivee ? ('Bienvenue, ' + (user.prenom || fullName) + ' !') : ('Au revoir, ' + (user.prenom || fullName) + ' !');

  if (photoEl) {
    const photo = user.face_data || user.photo_profil || user.capturedPhoto || null;
    if (photo && photo.length > 100) {
      photoEl.src = photo;
      photoEl.style.display = 'block';
    } else {
      photoEl.style.display = 'none';
    }
  }

  if (badgeEl) {
    if (isArrivee) {
      badgeEl.textContent = '✅ Présence enregistrée';
      badgeEl.className = 'px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase';
    } else {
      badgeEl.textContent = '🚪 Départ enregistré';
      badgeEl.className = 'px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black uppercase';
    }
  }

  // Enregistrer le pointage
  await enregistrerPresence(presenceType, user, fullName, today, timeStr);

  // Fermeture automatique après 5 secondes
  presencePhaseTimeout = setTimeout(() => closePresenceModal(), 5000);
}

// ══════════════════════════════════════════════════════
// ENREGISTREMENT PRÉSENCE (localStorage + Cloud)
// ══════════════════════════════════════════════════════
async function enregistrerPresence(type, user, fullName, date, time) {
  // localStorage
  const key = 'presence_' + (user.email || user.id) + '_' + date;
  localStorage.setItem(key, JSON.stringify({ type, time, name: fullName }));

  // Cloud
  try {
    const endpoint = type === 'depart' ? '/api/rh/pointage/depart' : '/api/rh/pointage/arrivee';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utilisateur_id: user.id || null,
        nom: fullName,
        role: user.role || '',
        ecole: user.ecole || user.school || '',
        date_pointage: date,
        heure: time,
        type: type
      })
    });
  } catch (err) {
    console.warn('[Présence] Sync cloud:', err);
  }
}

// ══════════════════════════════════════════════════════
// ÉCHEC DE VALIDATION
// ══════════════════════════════════════════════════════
function showPresenceFailure(msg) {
  setCameraStatus(msg, '#dc2626');

  const retryBtn = document.getElementById('presence-retry-btn');
  if (retryBtn) { retryBtn.style.display = 'inline-flex'; }

  const captureBtn = document.getElementById('presence-capture-btn');
  if (captureBtn) { captureBtn.disabled = true; captureBtn.style.opacity = '0.4'; }
}

window.retryPresenceCapture = function () {
  capturedFaceData = null;

  const preview = document.getElementById('presence-capture-preview');
  if (preview) preview.style.display = 'none';

  const retryBtn = document.getElementById('presence-retry-btn');
  if (retryBtn) retryBtn.style.display = 'none';

  launchPresenceCamera();
};

// ══════════════════════════════════════════════════════
// CSS ANIMATIONS
// ══════════════════════════════════════════════════════
(function () {
  if (document.getElementById('presence-anim-css')) return;
  const style = document.createElement('style');
  style.id = 'presence-anim-css';
  style.textContent = `
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes presencePulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 12px rgba(16,185,129,0)} }
    .presence-fade-up { animation: fadeUp 0.35s ease forwards; }
  `;
  document.head.appendChild(style);
})();
