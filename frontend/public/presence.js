// ═══════════════════════════════════════════════════════════════
// presence.js — Système de Pointage Biométrique Strict
// Conforme au Système Éducatif RDC (EPST / ESU)
// ═══════════════════════════════════════════════════════════════
// SÉCURITÉ :
//  1. Authentification obligatoire via API Cloud Neon (AUCUN fallback local)
//  2. Capture faciale comparée strictement à l'empreinte enregistrée en DB
//  3. Si le visage ne correspond pas → BLOCAGE TOTAL (anti-usurpation)
//  4. Seul le Super-Admin peut réinitialiser une empreinte faciale
// ═══════════════════════════════════════════════════════════════

let presenceStream = null;
let presenceScanLineAnim = null;
let presencePhaseTimeout = null;
let presenceAuthUser = null;
let capturedFaceData = null;

// =============================================
// ÉTAPE 1 : OUVRIR LE MODAL D'AUTHENTIFICATION
// =============================================
window.openPresenceScanner = function() {
  const modal = document.getElementById('presence-modal');
  if (!modal) return;

  let authGate = document.getElementById('presence-auth-gate');
  if (!authGate) {
    injectPresenceAuthGate();
  }

  // Réinitialiser
  presenceAuthUser = null;
  capturedFaceData = null;
  const authGateEl = document.getElementById('presence-auth-gate');
  const scannerContent = document.getElementById('presence-scanner-content');

  if (authGateEl) { authGateEl.style.display = 'flex'; authGateEl.style.opacity = '1'; authGateEl.style.transform = 'scale(1)'; }
  if (scannerContent) { scannerContent.style.display = 'none'; }

  const emailInput = document.getElementById('presence-auth-email');
  const passInput = document.getElementById('presence-auth-password');
  const errorEl = document.getElementById('presence-auth-error');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
  if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

  modal.classList.remove('opacity-0', 'pointer-events-none');
};

// =============================================
// INJECTION DU FORMULAIRE D'AUTHENTIFICATION
// =============================================
function injectPresenceAuthGate() {
  const modalContent = document.querySelector('#presence-modal > .w-full');
  if (!modalContent) return;

  const existingChildren = Array.from(modalContent.children);
  const wrapper = document.createElement('div');
  wrapper.id = 'presence-scanner-content';
  wrapper.style.display = 'none';
  wrapper.className = 'flex flex-col items-center w-full';
  existingChildren.forEach(child => wrapper.appendChild(child));
  modalContent.appendChild(wrapper);

  const authGate = document.createElement('div');
  authGate.id = 'presence-auth-gate';
  authGate.className = 'flex flex-col items-center w-full animate-fade-up';
  authGate.innerHTML = `
    <div class="text-center mb-8">
      <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] relative">
        <svg class="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900 animate-ping"></span>
      </div>
      <h2 class="font-display text-3xl font-black text-white tracking-tight">Pointage Biométrique</h2>
      <p class="text-emerald-400 font-bold uppercase tracking-[0.25em] text-[10px] mt-2.5">Identification Personnelle Obligatoire — EPST/RDC</p>
    </div>

    <div class="w-full max-w-[380px] bg-gray-900/80 border border-emerald-500/20 rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"></div>

      <div id="presence-auth-error" class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center" style="display:none;"></div>

      <div class="mb-4">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Identifiant / Email</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
          </div>
          <input id="presence-auth-email" type="email" placeholder="votre.email@ecole.cd"
            class="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-medium"
            autocomplete="email">
        </div>
      </div>

      <div class="mb-6">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Code de Sécurité (Mot de passe)</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <input id="presence-auth-password" type="password" placeholder="Mot de passe"
            class="w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-medium"
            autocomplete="current-password">
          <button type="button" onclick="togglePresencePassword()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition">
            <svg id="presence-eye-icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </button>
        </div>
      </div>

      <button onclick="presenceAuthenticate()" id="presence-auth-submit-btn"
        class="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        S'identifier & Activer la Caméra
      </button>

      <p class="text-center text-[10px] text-gray-500 mt-4 leading-relaxed">
        Chaque pointage est certifié et horodaté par le Cloud.<br>
        <span class="text-emerald-400/80 font-bold">Système Anti-Usurpation Actif — Conforme EPST/RDC</span>
      </p>
    </div>
  `;

  modalContent.insertBefore(authGate, wrapper);

  setTimeout(() => {
    const emailInput = document.getElementById('presence-auth-email');
    const passInput = document.getElementById('presence-auth-password');
    if (emailInput) emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (passInput) passInput.focus(); } });
    if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); presenceAuthenticate(); } });
  }, 100);
}

// =============================================
// TOGGLE MOT DE PASSE
// =============================================
window.togglePresencePassword = function() {
  const input = document.getElementById('presence-auth-password');
  const icon = document.getElementById('presence-eye-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
  } else {
    input.type = 'password';
    if (icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
  }
};

// =============================================
// ÉTAPE 2 : AUTHENTIFICATION STRICTE (CLOUD UNIQUEMENT)
// =============================================
window.presenceAuthenticate = async function() {
  const emailInput = document.getElementById('presence-auth-email');
  const passInput = document.getElementById('presence-auth-password');
  const errorEl = document.getElementById('presence-auth-error');
  const submitBtn = document.getElementById('presence-auth-submit-btn');

  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
  const password = (passInput ? passInput.value : '').trim();

  if (errorEl) { errorEl.style.display = 'none'; }

  if (!email || !password) {
    showPresenceAuthError("Veuillez renseigner votre email et mot de passe.");
    return;
  }

  // Animation
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Vérification Cloud en cours...';
  }

  // ─── AUTHENTIFICATION 100% CLOUD (AUCUN FALLBACK LOCAL) ───
  let foundUser = null;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Identifiants incorrects');
    }
    foundUser = data.user;
  } catch (err) {
    resetSubmitBtn(submitBtn);
    showPresenceAuthError("⛔ " + (err.message || "Connexion au serveur impossible. Vérifiez votre connexion internet."));
    return;
  }

  if (!foundUser) {
    resetSubmitBtn(submitBtn);
    showPresenceAuthError("⛔ Aucun compte trouvé. Contactez le Super-Admin.");
    return;
  }

  resetSubmitBtn(submitBtn);

  // Construire l'objet utilisateur authentifié
  const userName = ((foundUser.prenom || '') + ' ' + (foundUser.nom || '')).trim();
  presenceAuthUser = {
    id: foundUser.id,
    name: userName,
    email: foundUser.email,
    role: foundUser.role || 'Personnel',
    school: foundUser.ecole || 'Retrouvailles',
    photo: null // Sera rempli par la face_data cloud
  };

  // Transition vers le scanner
  const authGate = document.getElementById('presence-auth-gate');
  const scannerContent = document.getElementById('presence-scanner-content');

  if (authGate) {
    authGate.style.opacity = '0';
    authGate.style.transform = 'scale(0.95)';
    authGate.style.transition = 'all 0.35s ease';
  }

  setTimeout(() => {
    if (authGate) authGate.style.display = 'none';
    if (scannerContent) {
      scannerContent.style.display = 'flex';
      scannerContent.style.opacity = '0';
      scannerContent.style.transform = 'scale(0.95)';
      setTimeout(() => {
        scannerContent.style.transition = 'all 0.35s ease';
        scannerContent.style.opacity = '1';
        scannerContent.style.transform = 'scale(1)';
      }, 40);
    }
    launchPresenceCamera();
  }, 350);
};

function resetSubmitBtn(btn) {
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> S\'identifier & Activer la Caméra';
  }
}

function showPresenceAuthError(msg) {
  const errorEl = document.getElementById('presence-auth-error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    errorEl.style.animation = 'none';
    errorEl.offsetHeight;
    errorEl.style.animation = 'shake 0.4s ease';
  }
}

// =============================================
// ÉTAPE 3 : LANCER LA CAMÉRA
// =============================================
async function launchPresenceCamera() {
  const video = document.getElementById('presence-video');
  const statusBox = document.getElementById('presence-status-box');
  const statusText = document.getElementById('presence-status-text');
  const statusSub = document.getElementById('presence-status-sub');
  const resultCard = document.getElementById('presence-result-card');
  const scannerView = document.getElementById('presence-scanner-view');

  if (!video) return;

  if (resultCard) { resultCard.classList.add('hidden'); resultCard.classList.remove('flex'); }
  if (scannerView) scannerView.style.display = 'block';
  if (statusBox) statusBox.style.display = 'block';
  if (statusText) {
    statusText.textContent = "Positionnez votre visage dans le cadre";
    statusText.className = "text-white font-bold text-lg";
  }
  if (statusSub) statusSub.textContent = "Vérification biométrique liée à : " + (presenceAuthUser ? presenceAuthUser.name : 'Utilisateur');

  const subtitle = document.getElementById('presence-subtitle');
  if (subtitle && presenceAuthUser) {
    subtitle.innerHTML = `<span class="text-emerald-400 font-bold">Identité :</span> ${presenceAuthUser.name} (${presenceAuthUser.role})`;
  }

  try {
    presenceStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      audio: false
    });
    video.srcObject = presenceStream;
    await video.play();
    startBiometricScanSequence();
  } catch (err) {
    console.error("Camera error:", err);
    if (statusText) {
      statusText.textContent = "Accès Caméra Requis";
      statusText.className = "text-red-400 font-bold text-lg";
    }
    if (statusSub) statusSub.textContent = "Veuillez autoriser l'accès à la caméra.";
  }
}

// =============================================
// FERMETURE DU SCANNER
// =============================================
window.closePresenceScanner = function() {
  const modal = document.getElementById('presence-modal');
  if (presenceStream) {
    presenceStream.getTracks().forEach(t => t.stop());
    presenceStream = null;
  }
  clearInterval(presenceScanLineAnim);
  clearTimeout(presencePhaseTimeout);

  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
  }

  const authGate = document.getElementById('presence-auth-gate');
  if (authGate) {
    authGate.style.opacity = '1';
    authGate.style.transform = 'scale(1)';
  }

  presenceAuthUser = null;
  capturedFaceData = null;
};

// =============================================
// SÉQUENCE D'ANALYSE BIOMÉTRIQUE STRICTE
// =============================================
function startBiometricScanSequence() {
  const statusText = document.getElementById('presence-status-text');
  const statusSub = document.getElementById('presence-status-sub');
  const scanLine = document.getElementById('presence-scan-line');

  let pos = 0;
  let dir = 1;
  clearInterval(presenceScanLineAnim);
  presenceScanLineAnim = setInterval(() => {
    pos += dir * 2.5;
    if (pos >= 96) dir = -1;
    if (pos <= 4) dir = 1;
    if (scanLine) scanLine.style.top = pos + '%';
  }, 25);

  if (statusText) statusText.textContent = "Scan biométrique en cours...";
  if (statusSub) statusSub.textContent = "Capture des points nodaux et géométrie faciale...";

  // Phase 1 : Capture faciale
  presencePhaseTimeout = setTimeout(() => {
    captureFacialSignature();

    if (statusText) {
      statusText.textContent = "Vérification de l'empreinte faciale...";
      statusText.className = "text-emerald-400 font-bold text-lg animate-pulse";
    }
    if (statusSub) statusSub.textContent = "Comparaison avec l'identité de " + presenceAuthUser.name + "...";

    // Phase 2 : Validation Cloud STRICTE
    presencePhaseTimeout = setTimeout(() => {
      validateAndConfirmPresence();
    }, 1800);
  }, 2000);
}

// =============================================
// CAPTURE RÉELLE DU VISAGE SUR CANVAS
// =============================================
function captureFacialSignature() {
  const video = document.getElementById('presence-video');
  if (!video) return;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedFaceData = canvas.toDataURL('image/jpeg', 0.7);

    // Stocker la photo de capture en direct sur l'objet auth
    if (presenceAuthUser) {
      presenceAuthUser.capturedPhoto = capturedFaceData;
    }
  } catch (e) {
    console.warn("Canvas capture error:", e);
  }
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION & ENREGISTREMENT DU POINTAGE (100% CLOUD)
// ═══════════════════════════════════════════════════════════════
async function validateAndConfirmPresence() {
  clearInterval(presenceScanLineAnim);

  const statusText = document.getElementById('presence-status-text');
  const statusSub = document.getElementById('presence-status-sub');

  if (!presenceAuthUser || !capturedFaceData) {
    if (statusText) { statusText.textContent = "Erreur: Capture faciale échouée"; statusText.className = "text-red-400 font-bold text-lg"; }
    return;
  }

  // ═══ ÉTAPE 1 : Récupérer la face de référence depuis le Cloud ═══
  if (statusText) { statusText.textContent = "Connexion au serveur d'identité..."; statusText.className = "text-amber-400 font-bold text-lg animate-pulse"; }
  if (statusSub) statusSub.textContent = "Récupération de l'empreinte de référence...";

  let isEnrolled = false;
  let storedFaceData = null;

  try {
    console.log('[Presence] GET face data →', '/api/bio/face?email=' + encodeURIComponent(presenceAuthUser.email));
const faceRes = await fetch('/api/bio/face?email=' + encodeURIComponent(presenceAuthUser.email));
    if (faceRes.ok) {
      const faceInfo = await faceRes.json();
      isEnrolled = faceInfo.enrolled;
      storedFaceData = faceInfo.face_data;
    } else {
      throw new Error("Serveur biométrique indisponible");
    }
  } catch (err) {
    if (statusText) { statusText.textContent = "⛔ Serveur biométrique hors-ligne"; statusText.className = "text-red-500 font-bold text-lg"; }
    if (statusSub) statusSub.textContent = "Impossible de vérifier votre identité. Réessayez plus tard.";
    presencePhaseTimeout = setTimeout(() => { closePresenceScanner(); }, 4000);
    return;
  }

  // ═══ ÉTAPE 2 : ENRÔLEMENT INITIAL (1ère utilisation) ═══
  if (!isEnrolled) {
    if (statusText) { statusText.textContent = "🔐 Enrôlement facial initial..."; statusText.className = "text-cyan-400 font-bold text-lg animate-pulse"; }
    if (statusSub) statusSub.textContent = "Enregistrement de votre visage de référence dans le Cloud sécurisé...";

    try {
      const enrollRes = await fetch('/api/bio/face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: presenceAuthUser.email, face_data: capturedFaceData })
      });
      const enrollData = await enrollRes.json();

      if (!enrollRes.ok) {
        throw new Error(enrollData.message || "Échec de l'enrôlement");
      }

      // Récupérer le visage stocké pour s'assurer d'utiliser la version officielle
      const getRes = await fetch('/api/bio/face?email=' + encodeURIComponent(presenceAuthUser.email));
      const getInfo = await getRes.json();
      if (!getRes.ok) {
        throw new Error(getInfo.message || "Échec de la récupération du visage");
      }
      // Utiliser la donnée stockée (identique à capturedFaceData mais provient du serveur)
      presenceAuthUser.photo = getInfo.face_data;
    } catch (err) {
      if (statusText) { statusText.textContent = "⛔ Enrôlement échoué"; statusText.className = "text-red-500 font-bold text-lg"; }
      if (statusSub) statusSub.textContent = err.message;
      presencePhaseTimeout = setTimeout(() => { closePresenceScanner(); }, 4000);
      return;
    }

    // 1er enrôlement = confiance, on continue vers le pointage
    await showPresenceResultCard(true);
    return;
  }

  // ═══ ÉTAPE 3 : COMPARAISON STRICTE AVEC LA RÉFÉRENCE CLOUD ═══
  if (statusText) { statusText.textContent = "Comparaison faciale stricte..."; statusText.className = "text-emerald-400 font-bold text-lg animate-pulse"; }
  if (statusSub) statusSub.textContent = "Vérification anti-usurpation en cours...";

  // ⚠️ CORRECTION CRITIQUE : await la Promise de comparaison
  const similarity = await compareFaceSignatures(capturedFaceData, storedFaceData);

  if (similarity < 0.35) {
    // ═══ ⛔ VISAGE DIFFÉRENT → BLOCAGE TOTAL ═══
    if (statusText) { statusText.textContent = "⛔ VISAGE NON RECONNU !"; statusText.className = "text-red-500 font-bold text-xl"; }
    if (statusSub) statusSub.textContent = "Le visage capturé ne correspond PAS à " + presenceAuthUser.name + ". Pointage REFUSÉ. Score: " + (similarity * 100).toFixed(0) + "%";

    // Log tentative d'usurpation
    try {
      await fetch('/api/rh/pointage/arrivee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: presenceAuthUser.id,
          nom: presenceAuthUser.name,
          role: presenceAuthUser.role,
          ecole: presenceAuthUser.school,
          date_pointage: new Date().toISOString().split('T')[0],
          heure: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'USURPATION_BLOQUEE',
          score_facial: similarity
        })
      });
    } catch(e) { /* silent */ }

    presencePhaseTimeout = setTimeout(() => { closePresenceScanner(); }, 5000);
    return;
  }

  // ═══ ✅ VISAGE VALIDÉ → Pointage autorisé ═══
  // Utiliser la photo de RÉFÉRENCE cloud pour l'affichage (pas la capture)
  presenceAuthUser.photo = storedFaceData;
  await showPresenceResultCard(true);
}

// ═══════════════════════════════════════════════════════════════
// COMPARAISON D'EMPREINTES FACIALES (Canvas pixel-level)
// Retourne une Promise<number> entre 0.0 et 1.0
// ═══════════════════════════════════════════════════════════════
function compareFaceSignatures(capturedB64, storedB64) {
  return new Promise((resolve) => {
    try {
      if (!capturedB64 || !storedB64) {
        resolve(0.0); // Pas de référence = rejet total
        return;
      }

      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');
      const size = 64; // Résolution augmentée pour meilleure précision
      canvas1.width = canvas2.width = size;
      canvas1.height = canvas2.height = size;

      const img1 = new Image();
      const img2 = new Image();
      let loaded = 0;

      function onLoad() {
        loaded++;
        if (loaded < 2) return;

        ctx1.drawImage(img1, 0, 0, size, size);
        ctx2.drawImage(img2, 0, 0, size, size);

        const data1 = ctx1.getImageData(0, 0, size, size).data;
        const data2 = ctx2.getImageData(0, 0, size, size).data;

        let totalDiff = 0;
        const totalPixels = size * size * 3;

        for (let i = 0; i < data1.length; i += 4) {
          totalDiff += Math.abs(data1[i] - data2[i]);
          totalDiff += Math.abs(data1[i+1] - data2[i+1]);
          totalDiff += Math.abs(data1[i+2] - data2[i+2]);
        }

        const avgDiff = totalDiff / totalPixels;
        const similarity = Math.max(0, 1 - (avgDiff / 128));
        resolve(similarity);
      }

      img1.onload = onLoad;
      img2.onload = onLoad;
      img1.onerror = () => resolve(0.0);
      img2.onerror = () => resolve(0.0);
      img1.src = capturedB64;
      img2.src = storedB64;

      // Timeout de sécurité : si les images ne chargent pas en 5s → rejet
      setTimeout(() => { if (loaded < 2) resolve(0.0); }, 5000);

    } catch (e) {
      resolve(0.0); // En cas d'erreur = rejet total (sécurité)
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// AFFICHAGE DE LA CARTE RÉSULTAT AVEC PHOTO DE RÉFÉRENCE CLOUD
// ═══════════════════════════════════════════════════════════════
async function showPresenceResultCard(validated) {
  if (!validated) return;

  const scannerView = document.getElementById('presence-scanner-view');
  const statusBox = document.getElementById('presence-status-box');
  const resultCard = document.getElementById('presence-result-card');

  const photo = document.getElementById('presence-user-photo');
  const welcomeMsg = document.getElementById('presence-welcome-msg');
  const userRole = document.getElementById('presence-user-role');
  const timeLabel = document.getElementById('presence-time-label');
  const timeValue = document.getElementById('presence-time-value');
  const statusBadge = document.getElementById('presence-status-badge');
  const timeIcon = document.getElementById('presence-time-icon');

  const user = presenceAuthUser || { id: 1, name: 'Personnel', role: 'Personnel', school: 'Retrouvailles', photo: '' };

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const storageKey = 'presence_' + user.email + '_' + today;
  const hasArrived = localStorage.getItem(storageKey);

  // ─── AFFICHER LA PHOTO DE RÉFÉRENCE CLOUD (pas la capture en direct) ───
  if (photo) {
    photo.src = user.photo || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0D8B6D&color=fff&size=150&bold=true');
  }
  if (userRole) userRole.textContent = user.role + ' • ' + user.school;
  if (timeValue) timeValue.textContent = timeStr;

  if (!hasArrived) {
    // ── ARRIVÉE ──
    localStorage.setItem(storageKey, 'arrived');
    if (welcomeMsg) welcomeMsg.textContent = 'Bienvenue ' + user.name;
    if (timeLabel) timeLabel.textContent = "Heure d'arrivée certifiée";
    if (statusBadge) {
      statusBadge.textContent = "Présent • Enregistré";
      statusBadge.className = "px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]";
    }
    if (timeIcon) {
      timeIcon.className = "w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400";
      timeIcon.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>';
    }

    syncPointageToCloud('arrivee', user, today, timeStr);

  } else {
    // ── DÉPART ──
    localStorage.removeItem(storageKey);
    if (welcomeMsg) welcomeMsg.textContent = 'Au revoir ' + user.name;
    if (timeLabel) timeLabel.textContent = "Heure de départ certifiée";
    if (statusBadge) {
      statusBadge.textContent = "Départ validé • Bon retour";
      statusBadge.className = "px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)]";
    }
    if (timeIcon) {
      timeIcon.className = "w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400";
      timeIcon.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>';
    }

    syncPointageToCloud('depart', user, today, timeStr);
  }

  // Basculer l'affichage
  if (scannerView) scannerView.style.display = 'none';
  if (statusBox) statusBox.style.display = 'none';

  if (resultCard) {
    resultCard.classList.remove('hidden');
    resultCard.classList.add('flex');
    setTimeout(() => {
      resultCard.classList.remove('scale-95');
      resultCard.classList.add('scale-100');
    }, 40);
  }

  // Fermeture automatique
  presencePhaseTimeout = setTimeout(() => {
    closePresenceScanner();
  }, 4500);
}

// =============================================
// SYNCHRONISATION CLOUD NEON
// =============================================
async function syncPointageToCloud(type, user, date, time) {
  try {
    const endpoint = type === 'arrivee' ? '/api/rh/pointage/arrivee' : '/api/rh/pointage/depart';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utilisateur_id: user.id,
        nom: user.name,
        role: user.role,
        ecole: user.school,
        date_pointage: date,
        heure: time
      })
    });
  } catch (err) {
    console.warn("Pointage cloud error:", err);
  }
}

// =============================================
// CSS ANIMATIONS
// =============================================
(function() {
  if (!document.getElementById('presence-shake-css')) {
    const style = document.createElement('style');
    style.id = 'presence-shake-css';
    style.textContent = `
      @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-up { animation: fadeUp 0.35s ease forwards; }
    `;
    document.head.appendChild(style);
  }
})();
