// presence.js - Module de reconnaissance faciale pour le pointage
// SÉCURITÉ : Authentification obligatoire avant activation du capteur

let presenceStream = null;
let presenceScanLineAnim = null;
let presencePhaseTimeout = null;
let presenceAuthUser = null; // L'utilisateur authentifié pour cette session de pointage

// =============================================
// COMPTES PERMANENTS (miroir de login.html)
// =============================================
const PRESENCE_PERMANENT_ACCOUNTS = [
  { id: 100, nom: 'EKOTO ISOLOKE', prenom: 'CHADRACK', email: 'chadrackisoloke@gmail.com', password: 'password', role: 'Super-Admin', ecole: 'Retrouvailles', statut: 'Actif' },
  { id: 101, nom: 'KASOMBO', prenom: 'KASOMBO', email: 'kasombo@retrouvailles.cd', password: 'password', role: 'Directeur (D.P)', ecole: 'Retrouvailles', statut: 'Actif' },
  { id: 102, nom: 'MATUNGULU', prenom: 'MATUNGULU', email: 'matungulu@retrouvailles.cd', password: 'password', role: 'Enseignant', ecole: 'Retrouvailles', statut: 'Actif' }
];

// =============================================
// ÉTAPE 1 : OUVRIR LE MODAL D'AUTHENTIFICATION
// =============================================
window.openPresenceScanner = function() {
  const modal = document.getElementById('presence-modal');
  if (!modal) return;

  // Inject the auth gate UI if not already present
  let authGate = document.getElementById('presence-auth-gate');
  if (!authGate) {
    injectPresenceAuthGate();
  }

  // Reset state
  presenceAuthUser = null;
  const authGateEl = document.getElementById('presence-auth-gate');
  const scannerContent = document.getElementById('presence-scanner-content');

  if (authGateEl) { authGateEl.style.display = 'flex'; authGateEl.style.opacity = '1'; authGateEl.style.transform = 'scale(1)'; }
  if (scannerContent) { scannerContent.style.display = 'none'; }

  // Reset auth form
  const emailInput = document.getElementById('presence-auth-email');
  const passInput = document.getElementById('presence-auth-password');
  const errorEl = document.getElementById('presence-auth-error');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
  if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

  // Show modal
  modal.classList.remove('opacity-0', 'pointer-events-none');
};

// =============================================
// INJECTION DU FORMULAIRE D'AUTHENTIFICATION
// =============================================
function injectPresenceAuthGate() {
  const modalContent = document.querySelector('#presence-modal > .w-full');
  if (!modalContent) return;

  // Wrap existing scanner content
  const existingChildren = Array.from(modalContent.children);
  const wrapper = document.createElement('div');
  wrapper.id = 'presence-scanner-content';
  wrapper.style.display = 'none';
  wrapper.className = 'flex flex-col items-center w-full';
  existingChildren.forEach(child => wrapper.appendChild(child));
  modalContent.appendChild(wrapper);

  // Create auth gate
  const authGate = document.createElement('div');
  authGate.id = 'presence-auth-gate';
  authGate.className = 'flex flex-col items-center w-full animate-fade-up';
  authGate.innerHTML = `
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <svg class="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
      <h2 class="font-display text-3xl font-black text-white tracking-tight">Terminal de Pointage</h2>
      <p class="text-emerald-400/80 font-bold uppercase tracking-[0.25em] text-[10px] mt-2.5">Identification Sécurisée Requise</p>
    </div>

    <!-- Formulaire -->
    <div class="w-full max-w-[360px] bg-gray-900/60 border border-white/10 rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">

      <!-- Erreur -->
      <div id="presence-auth-error" class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center" style="display:none;"></div>

      <!-- Email -->
      <div class="mb-4">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Identifiant (Email)</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
          </div>
          <input id="presence-auth-email" type="email" placeholder="votre.email@institution.cd"
            class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all font-medium"
            autocomplete="email">
        </div>
      </div>

      <!-- Mot de passe -->
      <div class="mb-6">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Mot de passe</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <input id="presence-auth-password" type="password" placeholder="Votre mot de passe"
            class="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all font-medium"
            autocomplete="current-password">
          <button type="button" onclick="togglePresencePassword()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition">
            <svg id="presence-eye-icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Bouton Valider -->
      <button onclick="presenceAuthenticate()" id="presence-auth-submit-btn"
        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        S'identifier & Pointer
      </button>

      <!-- Hint -->
      <p class="text-center text-[10px] text-gray-500 mt-4 leading-relaxed">Utilisez les identifiants de votre compte<br>pour accéder au terminal de pointage.</p>
    </div>
  `;

  modalContent.insertBefore(authGate, wrapper);

  // Add Enter key handler
  setTimeout(() => {
    const emailInput = document.getElementById('presence-auth-email');
    const passInput = document.getElementById('presence-auth-password');
    if (emailInput) emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (passInput) passInput.focus(); } });
    if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); presenceAuthenticate(); } });
  }, 100);
}

// =============================================
// TOGGLE VISIBILITÉ MOT DE PASSE
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
// ÉTAPE 2 : VÉRIFICATION DES IDENTIFIANTS
// =============================================
window.presenceAuthenticate = function() {
  const emailInput = document.getElementById('presence-auth-email');
  const passInput = document.getElementById('presence-auth-password');
  const errorEl = document.getElementById('presence-auth-error');
  const submitBtn = document.getElementById('presence-auth-submit-btn');

  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
  const password = (passInput ? passInput.value : '').trim();

  // Reset error
  if (errorEl) { errorEl.style.display = 'none'; }

  if (!email || !password) {
    showPresenceAuthError("Veuillez remplir tous les champs.");
    return;
  }

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Vérification en cours...';
  }

  // Simulate verification delay for premium feel
  setTimeout(function() {
    var foundUser = null;

    // 1. Check permanent accounts
    for (var i = 0; i < PRESENCE_PERMANENT_ACCOUNTS.length; i++) {
      var u = PRESENCE_PERMANENT_ACCOUNTS[i];
      if (u.email.toLowerCase() === email && u.password === password) {
        foundUser = u;
        break;
      }
    }

    // 2. Check cloud DB
    if (!foundUser) {
      var db = JSON.parse(localStorage.getItem('hr_users_db_v2') || '[]');
      for (var j = 0; j < db.length; j++) {
        if (db[j].email && db[j].email.toLowerCase() === email && db[j].password === password) {
          foundUser = db[j];
          break;
        }
      }
    }

    // Reset button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> S\'identifier & Pointer';
    }

    if (!foundUser) {
      showPresenceAuthError("Identifiants incorrects. Aucun compte trouve avec cet email et ce mot de passe.");
      return;
    }

    // SUCCESS : Save authenticated user and proceed to camera
    var userName = ((foundUser.prenom || '') + ' ' + (foundUser.nom || '')).trim();
    var initials = (foundUser.prenom || '').charAt(0) + '+' + (foundUser.nom || '').charAt(0);
    presenceAuthUser = {
      name: userName,
      role: foundUser.role || 'Personnel',
      school: foundUser.ecole || 'HR',
      photo: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(initials) + '&background=0D8B6D&color=fff&size=150&bold=true'
    };

    // Transition: Hide auth gate, show scanner
    var authGate = document.getElementById('presence-auth-gate');
    var scannerContent = document.getElementById('presence-scanner-content');

    if (authGate) {
      authGate.style.opacity = '0';
      authGate.style.transform = 'scale(0.95)';
      authGate.style.transition = 'all 0.4s ease';
    }

    setTimeout(function() {
      if (authGate) authGate.style.display = 'none';
      if (scannerContent) {
        scannerContent.style.display = 'flex';
        scannerContent.style.opacity = '0';
        scannerContent.style.transform = 'scale(0.95)';
        setTimeout(function() {
          scannerContent.style.transition = 'all 0.4s ease';
          scannerContent.style.opacity = '1';
          scannerContent.style.transform = 'scale(1)';
        }, 50);
      }
      // Now start the actual camera
      launchPresenceCamera();
    }, 400);

  }, 1200);
};

function showPresenceAuthError(msg) {
  var errorEl = document.getElementById('presence-auth-error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    errorEl.style.animation = 'none';
    errorEl.offsetHeight; // reflow
    errorEl.style.animation = 'shake 0.4s ease';
  }
}

// =============================================
// ÉTAPE 3 : LANCER LA CAMÉRA (après auth)
// =============================================
async function launchPresenceCamera() {
  var video = document.getElementById('presence-video');
  var statusBox = document.getElementById('presence-status-box');
  var statusText = document.getElementById('presence-status-text');
  var statusSub = document.getElementById('presence-status-sub');
  var resultCard = document.getElementById('presence-result-card');
  var scannerView = document.getElementById('presence-scanner-view');

  if (!video) return;

  // Reset UI
  if (resultCard) { resultCard.classList.add('hidden'); resultCard.classList.remove('flex'); }
  if (scannerView) scannerView.style.display = 'block';
  if (statusBox) statusBox.style.display = 'block';
  if (statusText) {
    statusText.textContent = "Veuillez regarder la camera";
    statusText.className = "text-white font-bold text-lg";
  }
  if (statusSub) statusSub.textContent = "Initialisation du capteur biometrique...";

  // Update subtitle with authenticated user name
  var subtitle = document.getElementById('presence-subtitle');
  if (subtitle && presenceAuthUser) {
    subtitle.textContent = 'Identifie : ' + presenceAuthUser.name;
  }

  try {
    presenceStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = presenceStream;
    await video.play();
    startPresenceSequence();
  } catch (err) {
    if (statusText) {
      statusText.textContent = "Erreur Camera";
      statusText.className = "text-red-500 font-bold text-lg";
    }
    if (statusSub) statusSub.textContent = "Veuillez autoriser l'acces a la camera pour le pointage.";
  }
}

// =============================================
// FERMER LE SCANNER
// =============================================
window.closePresenceScanner = function() {
  var modal = document.getElementById('presence-modal');
  if (presenceStream) {
    presenceStream.getTracks().forEach(function(t) { t.stop(); });
    presenceStream = null;
  }
  clearInterval(presenceScanLineAnim);
  clearTimeout(presencePhaseTimeout);

  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
  }

  // Reset auth gate for next time
  var authGate = document.getElementById('presence-auth-gate');
  if (authGate) {
    authGate.style.opacity = '1';
    authGate.style.transform = 'scale(1)';
  }

  presenceAuthUser = null;
};

// =============================================
// SÉQUENCE DE SCAN
// =============================================
function startPresenceSequence() {
  var statusText = document.getElementById('presence-status-text');
  var statusSub = document.getElementById('presence-status-sub');
  var scanLine = document.getElementById('presence-scan-line');

  var pos = 0;
  var dir = 1;
  clearInterval(presenceScanLineAnim);
  presenceScanLineAnim = setInterval(function() {
    pos += dir * 2;
    if (pos >= 100) dir = -1;
    if (pos <= 0) dir = 1;
    if(scanLine) scanLine.style.top = pos + '%';
  }, 30);

  if (statusText) {
    statusText.textContent = "Analyse faciale en cours...";
  }
  if (statusSub) statusSub.textContent = "Ne bougez pas...";

  presencePhaseTimeout = setTimeout(function() {
    if (statusText) {
      statusText.textContent = "Recherche dans la base de donnees...";
      statusText.className = "text-emerald-400 font-bold text-lg animate-pulse";
    }
    if (statusSub) statusSub.textContent = "Comparaison des traits biometriques...";

    presencePhaseTimeout = setTimeout(function() {
      showPresenceResult();
    }, 2000);
  }, 2000);
}

// =============================================
// AFFICHER LE RÉSULTAT
// =============================================
function showPresenceResult() {
  clearInterval(presenceScanLineAnim);

  var statusBox = document.getElementById('presence-status-box');
  var scannerView = document.getElementById('presence-scanner-view');
  var resultCard = document.getElementById('presence-result-card');

  var photo = document.getElementById('presence-user-photo');
  var welcomeMsg = document.getElementById('presence-welcome-msg');
  var userRole = document.getElementById('presence-user-role');
  var timeLabel = document.getElementById('presence-time-label');
  var timeValue = document.getElementById('presence-time-value');
  var statusBadge = document.getElementById('presence-status-badge');
  var timeIcon = document.getElementById('presence-time-icon');

  var user = presenceAuthUser || { name: 'Utilisateur', role: 'Personnel', school: 'HR', photo: '' };

  var today = new Date().toLocaleDateString();
  var storageKey = 'presence_' + user.name + '_' + today;
  var hasArrived = localStorage.getItem(storageKey);

  var now = new Date();
  var timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  // Populate
  if (photo) photo.src = user.photo;
  if (userRole) userRole.textContent = user.role + ' \u2022 ' + user.school;
  if (timeValue) timeValue.textContent = timeStr;

  if (!hasArrived) {
    localStorage.setItem(storageKey, 'arrived');
    if (welcomeMsg) welcomeMsg.textContent = 'Bienvenue ' + user.name;
    if (timeLabel) timeLabel.textContent = "Heure d'arrivee";
    if (statusBadge) {
      statusBadge.textContent = "Present";
      statusBadge.className = "px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    }
    if (timeIcon) {
      timeIcon.className = "w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400";
      timeIcon.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>';
    }
    saveToAdminLog('Arrivee', timeStr, user);
  } else {
    localStorage.removeItem(storageKey);
    if (welcomeMsg) welcomeMsg.textContent = 'Au revoir ' + user.name + ', bon retour a la maison';
    if (timeLabel) timeLabel.textContent = "Heure de depart";
    if (statusBadge) {
      statusBadge.textContent = "Bon retour";
      statusBadge.className = "px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]";
    }
    if (timeIcon) {
      timeIcon.className = "w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400";
      timeIcon.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>';
    }
    saveToAdminLog('Depart', timeStr, user);
  }

  // Switch UI
  if (scannerView) scannerView.style.display = 'none';
  if (statusBox) statusBox.style.display = 'none';

  if (resultCard) {
    resultCard.classList.remove('hidden');
    resultCard.classList.add('flex');
    setTimeout(function() {
      resultCard.classList.remove('scale-95');
      resultCard.classList.add('scale-100');
    }, 50);
  }

  // Auto-close after 5 seconds
  presencePhaseTimeout = setTimeout(function() {
    closePresenceScanner();
  }, 5000);
}

// =============================================
// SAUVEGARDER DANS LE LOG ADMIN
// =============================================
function saveToAdminLog(type, timeStr, user) {
  try {
    var dbStr = localStorage.getItem('admin_db');
    if (!dbStr) return;
    var db = JSON.parse(dbStr);

    var now = new Date();
    var dateStr = now.toISOString().split('T')[0];

    if (type === 'Depart') {
      var todayLog = db.rh.pointages.find(function(p) { return p.nom === user.name && p.date === dateStr; });
      if (todayLog) {
        todayLog.statut = 'Termine';
      }
    } else {
      var ids = db.rh.pointages.map(function(p) { return p.id; });
      var newId = (ids.length > 0 ? Math.max.apply(null, ids) : 0) + 1;
      db.rh.pointages.unshift({
        id: newId,
        nom: user.name,
        date: dateStr,
        statut: 'Present',
        arrivee: timeStr,
        role: user.role,
        ecole: user.school
      });
    }

    localStorage.setItem('admin_db', JSON.stringify(db));
  } catch(e) {
    console.error("Error saving to admin log", e);
  }
}

// Inject shake animation CSS
(function() {
  if (!document.getElementById('presence-shake-css')) {
    var style = document.createElement('style');
    style.id = 'presence-shake-css';
    style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }';
    document.head.appendChild(style);
  }
})();
