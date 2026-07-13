/**
 * direction-auth.js
 * Logique interactive pour la modale d'authentification "Direction" Premium
 * ─────────────────────────────────────────────────────────────────────────
 * Inclut :
 *   • Dispatcher établissements (Harmonie / Retrouvailles)
 *   • Authentification Direction (Connexion / Création de compte)
 *   • Module de Pointage Biométrique du Personnel (Arrivée / Départ)
 */

/* ======================================================================
 * INITIALISATION — s'exécute après que le DOM est entièrement disponible
 * ====================================================================== */
const initDirectionModal = () => {

  /* ─────────────────────────────────────────────
   * 1. ÉLÉMENTS DOM — Modale principale
   * ───────────────────────────────────────────── */
  const modal            = document.getElementById('direction-auth-modal');
  const modalBox         = document.getElementById('direction-modal-box');
  const btnClose         = document.getElementById('close-direction-modal');
  const directionButtons = document.querySelectorAll('.btn-direction-trigger');

  // Vues
  const viewDispatcher = document.getElementById('view-dispatcher');
  const viewAuth       = document.getElementById('view-auth');

  // Cartes établissements
  const cardHarmonie      = document.getElementById('card-harmonie');
  const cardRetrouvailles = document.getElementById('card-retrouvailles');
  const selectedSchoolText = document.getElementById('selected-school-name');
  const btnBackToSchools  = document.getElementById('btn-back-schools');

  // Formulaire d'authentification
  const roleSelect     = document.getElementById('auth-role');
  const tabLogin       = document.getElementById('tab-login');
  const tabRegister    = document.getElementById('tab-register');
  const tabIndicator   = document.getElementById('tab-indicator');
  const authSubmitBtn  = document.getElementById('auth-submit-btn');
  const warningBadge   = document.getElementById('admin-warning-badge');

  /* ─────────────────────────────────────────────
   * 2. ÉLÉMENTS DOM — Module Biométrique
   * ───────────────────────────────────────────── */
  const bioStepA       = document.getElementById('bio-step-a');
  const bioStepB       = document.getElementById('bio-step-b');
  const bioLoading     = document.getElementById('bio-loading');
  const bioResult      = document.getElementById('bio-result');
  const bioActionBadge = document.getElementById('bio-action-badge');
  const bioLoadingText = document.getElementById('bio-loading-text');
  const btnArrivee     = document.getElementById('btn-arrivee');
  const btnDepart      = document.getElementById('btn-depart');
  const btnFingerprint = document.getElementById('btn-fingerprint');
  const btnBioBack     = document.getElementById('btn-bio-back');

  /* ─────────────────────────────────────────────
   * 3. DONNÉES DE CONFIGURATION
   * ───────────────────────────────────────────── */

  // Rôles par établissement
  const ROLES_HARMONIE = [
    { value: 'directeur',   label: 'Directeur'   },
    { value: 'sur-ecole',   label: 'Sur-école'   },
    { value: 'enseignant',  label: 'Enseignant'  },
  ];

  const ROLES_RETROUVAILLES = [
    { value: 'prefet',                label: 'Préfet'                          },
    { value: 'directeur-etudes',      label: 'Directeur des Études (D.E)'      },
    { value: 'directeur-discipline',  label: 'Directeur de Discipline (D.D)'   },
    { value: 'professeur',            label: 'Professeur'                      },
  ];

  /**
   * Données mock du personnel (en production : injectées après authentification JWT).
   * Chaque objet représente un agent connecté au poste de pointage.
   */
  const MOCK_PERSONNEL = [
    { name: 'M. Jean-Baptiste Kasongo', role: 'Directeur',   etablissement: 'G.S. Retrouvailles' },
    { name: 'Mme. Claire Mumbere',      role: 'Enseignante', etablissement: 'C.S. Harmonie'       },
    { name: 'M. Patrick Lukusa',        role: 'Préfet',      etablissement: 'G.S. Retrouvailles' },
  ];

  /* ─────────────────────────────────────────────
   * 4. ÉTAT INTERNE
   * ───────────────────────────────────────────── */
  let currentSchool    = null;      // 'harmonie' | 'retrouvailles'
  let currentMode      = 'login';   // 'login' | 'register'
  let selectedBioAction = null;     // 'arrivee' | 'depart'

  // Personnel simulé (tiré aléatoirement pour la démo)
  const randomPersonnel = () =>
    MOCK_PERSONNEL[Math.floor(Math.random() * MOCK_PERSONNEL.length)];

  /* ======================================================================
   * MODULE A — MODALE OPEN / CLOSE
   * ====================================================================== */

  /** Réinitialise le module biométrique à l'état initial (Étape A). */
  const resetBiometric = () => {
    selectedBioAction = null;
    showBioStep('a');
  };

  /** Ouvre la modale avec une animation cinématique. */
  const openModal = (e) => {
    e.preventDefault();

    // Réinitialise les vues
    viewDispatcher.classList.remove('hidden', 'opacity-0');
    viewAuth.style.display = 'none'; // caché via style inline
    currentSchool = null;
    resetBiometric();

    // Force le display flex (contourne le conflit hidden/flex de Tailwind)
    modal.style.display      = 'flex';
    modal.style.opacity      = '0';
    modal.style.transition   = '';

    // Double rAF pour garantir que le navigateur a bien rendu l'état initial
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity    = '1';
        modalBox.classList.remove('scale-95', 'opacity-0', 'translate-y-4');
        modalBox.classList.add('scale-100', 'opacity-100', 'translate-y-0');
      });
    });
  };

  /** Ferme la modale avec une animation de zoom-out fluide. */
  const closeModal = () => {
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity    = '0';
    modalBox.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
    modalBox.classList.add('scale-95', 'opacity-0', 'translate-y-4');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  };

  // Attachement des listeners d'ouverture/fermeture
  directionButtons.forEach(btn => btn.addEventListener('click', openModal));
  btnClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ======================================================================
   * MODULE B — DISPATCHER → FORMULAIRE D'AUTHENTIFICATION
   * ====================================================================== */

  /** Injecte les rôles disponibles en fonction de l'école sélectionnée. */
  const injectRoles = (school) => {
    if (!roleSelect) return;
    roleSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre rôle</option>';
    const roles = school === 'harmonie' ? ROLES_HARMONIE : ROLES_RETROUVAILLES;
    roles.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value       = value;
      opt.textContent = label;
      roleSelect.appendChild(opt);
    });
  };

  /** Transition animée du Dispatcher vers le formulaire d'auth. */
  const selectSchool = (schoolName, displayName) => {
    currentSchool = schoolName;
    if (selectedSchoolText) selectedSchoolText.textContent = displayName;
    injectRoles(schoolName);

    viewDispatcher.classList.add('opacity-0');
    setTimeout(() => {
      viewDispatcher.classList.add('hidden');
      // Affiche view-auth via style (plus de conflit hidden/flex)
      viewAuth.style.display = 'flex';
      viewAuth.style.flexDirection = 'column';
      void viewAuth.offsetWidth; // force reflow
      viewAuth.classList.remove('opacity-0', 'translate-x-4');
      viewAuth.classList.add('opacity-100', 'translate-x-0');
    }, 200);
  };

  cardHarmonie?.addEventListener('click',
    () => selectSchool('harmonie', 'C.S. Harmonie (Primaire)')
  );
  cardRetrouvailles?.addEventListener('click',
    () => selectSchool('retrouvailles', 'G.S. Retrouvailles (Humanités)')
  );

  /** Retour vers le dispatcher depuis le formulaire d'auth. */
  btnBackToSchools?.addEventListener('click', () => {
    viewAuth.classList.remove('opacity-100', 'translate-x-0');
    viewAuth.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => {
      viewAuth.style.display = 'none'; // cache via style inline
      viewDispatcher.classList.remove('hidden');
      void viewDispatcher.offsetWidth;
      viewDispatcher.classList.remove('opacity-0');
    }, 200);
  });

  /* ======================================================================
   * MODULE C — ONGLETS CONNEXION / CRÉATION DE COMPTE
   * ====================================================================== */

  const switchTab = (mode) => {
    currentMode = mode;
    const isLogin = mode === 'login';

    tabLogin?.classList.toggle('text-primary-900', isLogin);
    tabLogin?.classList.toggle('font-semibold', isLogin);
    tabLogin?.classList.toggle('text-gray-500', !isLogin);

    tabRegister?.classList.toggle('text-primary-900', !isLogin);
    tabRegister?.classList.toggle('font-semibold', !isLogin);
    tabRegister?.classList.toggle('text-gray-500', isLogin);

    if (tabIndicator) {
      tabIndicator.style.transform = isLogin ? 'translateX(0%)' : 'translateX(100%)';
    }
    if (authSubmitBtn) {
      authSubmitBtn.textContent = isLogin ? "Accéder à l'Espace" : "Créer le compte";
    }

    // Gestion via style inline
    if (warningBadge) {
      warningBadge.style.display = isLogin ? 'none' : 'flex';
    }

    // Gestion des champs d'inscription Premium
    const registerFields = document.getElementById('auth-register-fields');
    const confirmContainer = document.getElementById('auth-confirm-container');
    const backToLogin = document.getElementById('auth-back-to-login');
    const forgotLink = document.getElementById('auth-forgot-link');
    const passwordLabel = document.getElementById('auth-password-label');

    if (registerFields) registerFields.style.display = isLogin ? 'none' : 'block';
    if (confirmContainer) confirmContainer.style.display = isLogin ? 'none' : 'block';
    if (backToLogin) backToLogin.style.display = isLogin ? 'none' : 'block';
    
    if (forgotLink) forgotLink.style.display = isLogin ? 'inline' : 'none';
    if (passwordLabel) passwordLabel.textContent = isLogin ? 'Mot de passe' : 'Créer un mot de passe';

    // Gestion des blocs biométriques
    const bioRegister = document.getElementById('auth-bio-register');
    const bioLogin = document.getElementById('auth-bio-login');
    if (bioRegister) bioRegister.style.display = isLogin ? 'none' : 'block';
    if (bioLogin) bioLogin.style.display = isLogin ? 'grid' : 'none';
  };

  tabLogin?.addEventListener('click',    () => switchTab('login'));
  tabRegister?.addEventListener('click', () => switchTab('register'));
  
  // Bouton "Se connecter ->" en bas du form d'inscription
  document.getElementById('auth-switch-to-login-btn')?.addEventListener('click', () => switchTab('login'));

  switchTab('login'); // état initial

  /* ======================================================================
   * MODULE D — POINTAGE BIOMÉTRIQUE DU PERSONNEL
   * ====================================================================== */

  /**
   * Bascule entre les étapes du module biométrique.
   * Chaque étape (sauf 'result') utilise display:flex.
   * @param {'a'|'b'|'loading'|'result'} step
   */
  const showBioStep = (step) => {
    const registry = {
      a:       bioStepA,
      b:       bioStepB,
      loading: bioLoading,
      result:  bioResult,
    };

    // Cache tout
    Object.values(registry).forEach(el => {
      if (!el) return;
      el.classList.add('hidden');
      el.classList.remove('flex');
    });

    // Affiche la cible
    const target = registry[step];
    if (!target) return;
    target.classList.remove('hidden');
    if (step !== 'result') target.classList.add('flex'); // 'result' est block
  };

  /**
   * Sélectionne l'action (arrivée/départ) et bascule vers le scanner.
   * @param {'arrivee'|'depart'} action
   */
  const selectBioAction = (action) => {
    selectedBioAction = action;
    const isArrivee = action === 'arrivee';

    if (bioActionBadge) {
      bioActionBadge.className = [
        'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider',
        'inline-flex items-center gap-2',
        isArrivee
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-rose-100   text-rose-800   border border-rose-300',
      ].join(' ');

      bioActionBadge.innerHTML = `
        <span style="width:7px;height:7px;border-radius:50%;display:inline-block;
          background:${isArrivee ? '#10b981' : '#f43f5e'};
          box-shadow:0 0 6px ${isArrivee ? 'rgba(16,185,129,0.7)' : 'rgba(244,63,94,0.7)'};">
        </span>
        ${isArrivee ? 'Arrivée' : 'Départ'}
      `;
    }

    showBioStep('b');
  };

  /**
   * Simule le processus complet de scan biométrique.
   *
   * Flux :
   *   1. Affiche l'état de chargement (Étape C)
   *   2. Fait défiler des messages de progression (650ms chacun)
   *   3. Après 2.6s, injecte la carte de confirmation (Étape D)
   *
   * NOTE PRODUCTION : Remplacer l'await Promise par un appel WebAuthn :
   *   const cred = await navigator.credentials.get({ publicKey: { ... } });
   *   puis appel API REST pour enregistrer en base de données.
   */
  const simulateBiometricScan = async () => {
    // Empêcher les double-clics
    if (btnFingerprint) btnFingerprint.disabled = true;

    showBioStep('loading');

    const isRegister = selectedBioAction === 'register';

    const loadingMessages = isRegister 
      ? [
          "Initialisation du capteur...",
          "Lecture de l'empreinte...",
          "Création de la clé cryptographique...",
          "Enregistrement sécurisé..."
        ]
      : [
          'Lecture biométrique en cours...',
          "Vérification de l'identité...",
          'Authentification du personnel...',
          'Enregistrement du pointage...',
        ];

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx++;
      if (msgIdx < loadingMessages.length && bioLoadingText) {
        // Légère animation du texte
        bioLoadingText.style.opacity = '0';
        bioLoadingText.style.transform = 'translateY(4px)';
        setTimeout(() => {
          bioLoadingText.textContent = loadingMessages[msgIdx];
          bioLoadingText.style.opacity = '1';
          bioLoadingText.style.transform = 'translateY(0)';
          bioLoadingText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, 200);
      }
    }, 650);

    // ─── Simulation de l'API biométrique ───────────────────────────────
    // En production : remplacer par un vrai appel WebAuthn + fetch backend
    // ─────────────────────────────────────────────────────────────────────
    await new Promise(resolve => setTimeout(resolve, 2600));
    clearInterval(msgInterval);

    // Données du personnel (simulées — en prod : retournées par le backend)
    const personnel = randomPersonnel();

    // Heure et date exactes
    const now     = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const dateStr = now.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const isArrivee = selectedBioAction === 'arrivee';

    // Palette couleurs selon l'action
    let palette;
    if (isRegister) {
      palette = {
        cardBg:     'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
        cardBorder: '#c7d2fe',
        dotColor:   '#4f46e5',
        dotShadow:  'rgba(79,70,229,0.6)',
        labelColor: '#3730a3',
        sepColor:   '#c7d2fe',
        timeBg:     'linear-gradient(90deg, #4338ca, #4f46e5)',
        timeText:   '#ffffff',
        iconBg:     '#e0e7ff',
        iconColor:  '#3730a3',
        label:      '✓ Empreinte enregistrée',
        resetColor: '#4f46e5',
      };
    } else if (isArrivee) {
      palette = {
        cardBg:     'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
        cardBorder: '#a7f3d0',
        dotColor:   '#10b981',
        dotShadow:  'rgba(16,185,129,0.6)',
        labelColor: '#065f46',
        sepColor:   '#a7f3d0',
        timeBg:     'linear-gradient(90deg, #059669, #10b981)',
        timeText:   '#ffffff',
        iconBg:     '#d1fae5',
        iconColor:  '#065f46',
        label:      '✓ Arrivée enregistrée',
        resetColor: '#10b981',
      };
    } else {
      palette = {
        cardBg:     'linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)',
        cardBorder: '#fecdd3',
        dotColor:   '#f43f5e',
        dotShadow:  'rgba(244,63,94,0.6)',
        labelColor: '#9f1239',
        sepColor:   '#fecdd3',
        timeBg:     'linear-gradient(90deg, #be123c, #e11d48)',
        timeText:   '#ffffff',
        iconBg:     '#ffe4e6',
        iconColor:  '#9f1239',
        label:      '✓ Départ enregistré',
        resetColor: '#e11d48',
      };
    }

    const initial = personnel.name.charAt(0).toUpperCase();

    if (bioResult) {
      bioResult.innerHTML = `
        <div class="animate-bio-success flex flex-col items-center gap-5 text-center w-full">

          <!-- Icône de succès animée -->
          <div style="width:56px;height:56px;border-radius:50%;
            background:${palette.iconBg};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 0 8px ${palette.iconBg};">
            <svg style="width:28px;height:28px;color:${palette.iconColor};"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <!-- Carte de confirmation premium -->
          <div style="
            width:100%; max-width:340px;
            background:${palette.cardBg};
            border:1.5px solid ${palette.cardBorder};
            border-radius:20px;
            padding:20px;
            box-shadow:0 4px 24px rgba(0,0,0,0.06);
            text-align:left;
          ">
            <!-- En-tête : label + date -->
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
              <span style="
                font-size:11px;font-weight:700;text-transform:uppercase;
                letter-spacing:0.08em;color:${palette.labelColor};
                display:flex;align-items:center;gap:6px;
              ">
                <span style="
                  width:8px;height:8px;border-radius:50%;display:inline-block;
                  background:${palette.dotColor};
                  box-shadow:0 0 6px ${palette.dotShadow};
                "></span>
                ${palette.label}
              </span>
              <span style="font-size:10px;color:#9ca3af;text-align:right;line-height:1.4;max-width:100px;">
                ${dateStr}
              </span>
            </div>

            <!-- Identité du personnel -->
            <div style="display:flex;align-items:center;gap:12px;
              padding-bottom:16px;margin-bottom:16px;
              border-bottom:1px solid ${palette.sepColor};">
              <div style="
                width:44px;height:44px;border-radius:50%;flex-shrink:0;
                background:linear-gradient(135deg,#4f46e5,#3b82f6);
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:18px;font-weight:700;
                border:2px solid white;box-shadow:0 2px 8px rgba(79,70,229,0.35);
                font-family:'Poppins',sans-serif;
              ">
                ${initial}
              </div>
              <div>
                <p style="font-weight:700;color:#1e293b;font-size:14px;margin:0 0 2px;
                  font-family:'Poppins',sans-serif;">
                  ${personnel.name}
                </p>
                <p style="font-size:12px;color:#64748b;margin:0;font-family:'Inter',sans-serif;">
                  ${personnel.role} &middot; ${personnel.etablissement}
                </p>
              </div>
            </div>

            <!-- Heure de pointage en relief -->
            <div style="
              display:flex;align-items:center;justify-content:center;gap:10px;
              background:${palette.timeBg};
              color:${palette.timeText};
              border-radius:14px;
              padding:12px;
              box-shadow:0 4px 12px rgba(0,0,0,0.15);
            ">
              <svg style="width:20px;height:20px;opacity:0.85;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span style="
                font-size:24px;font-weight:700;letter-spacing:0.12em;
                font-family:'Courier New',monospace;
              ">${timeStr}</span>
            </div>
          </div>

          <!-- Bouton nouveau pointage -->
          <button id="btn-bio-reset"
            style="
              display:inline-flex;align-items:center;gap:8px;
              padding:10px 20px;border-radius:12px;
              font-size:13px;font-weight:600;cursor:pointer;
              color:#6366f1;background:transparent;
              border:1.5px solid #e0e7ff;
              transition:all 0.2s ease;
              font-family:'Inter',sans-serif;
            "
            onmouseover="this.style.background='#eef2ff';this.style.borderColor='#818cf8';"
            onmouseout="this.style.background='transparent';this.style.borderColor='#e0e7ff';"
          >
            <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Nouveau pointage
          </button>
        </div>
      `;
    }

    showBioStep('result');

    // Ré-active le bouton (pour les prochains usages)
    if (btnFingerprint) btnFingerprint.disabled = false;

    // Listener sur le bouton "Nouveau pointage" (injecté dynamiquement)
    document.getElementById('btn-bio-reset')?.addEventListener('click', () => {
      selectedBioAction = null;
      showBioStep('a');
    });
  };

  /* ─────────────────────────────────────────────
   * Listeners du module biométrique
   * ───────────────────────────────────────────── */
  btnArrivee?.addEventListener('click',     () => selectBioAction('arrivee'));
  btnDepart?.addEventListener('click',      () => selectBioAction('depart'));
  btnBioBack?.addEventListener('click',     () => showBioStep('a'));
  btnFingerprint?.addEventListener('click', simulateBiometricScan);

  // Boutons d'authentification biométrique premium (dans le formulaire)
  const btnBioRegister = document.getElementById('auth-bio-scan-register-btn');
  const btnBioArrivee = document.getElementById('auth-bio-login-arrivee-btn');
  const btnBioDepart = document.getElementById('auth-bio-login-depart-btn');

  const handleBioClick = async (action) => {
    const emailInput = document.getElementById('auth-email-input');
    if (emailInput && !emailInput.value.trim()) {
      alert("Veuillez d'abord entrer votre Identifiant (Email) pour utiliser la biométrie.");
      emailInput.focus();
      return;
    }
    selectedBioAction = action;
    await simulateBiometricScan();
  };

  btnBioRegister?.addEventListener('click', () => handleBioClick('register'));
  btnBioArrivee?.addEventListener('click', () => handleBioClick('arrivee'));
  btnBioDepart?.addEventListener('click', () => handleBioClick('depart'));

  // Initialisation : affiche l'étape A (choix d'action)
  showBioStep('a');

}; // fin de initDirectionModal


/* ======================================================================
 * DÉCLENCHEMENT — compatible ES Module (defer) et script classique
 * ====================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDirectionModal);
} else {
  initDirectionModal();
}
