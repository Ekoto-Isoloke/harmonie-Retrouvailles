import './style.css';
// Admin Dashboard v5.0 — ERP Direction EPST Kinshasa

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 20;

const defaultData = {
    version: DB_VERSION,
    ecoleActive: 'Harmonie',
    institutions: {
        Harmonie: {
            finance: {
                revenus: 45000,
                depenses: 12000,
                fraisScolaires: [
                    { classe: '1ère Maternelle', montant: 150 }, { classe: '2ème Maternelle', montant: 150 }, { classe: '3ème Maternelle', montant: 150 },
                    { classe: '1ère Primaire', montant: 170 }, { classe: '2ème Primaire', montant: 170 }, { classe: '3ème Primaire', montant: 170 },
                    { classe: '4ème Primaire', montant: 170 }, { classe: '5ème Primaire', montant: 170 }, { classe: '6ème Primaire', montant: 170 }
                ],
                recentPayments: [
                    { id: '101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Frais Scolaires', mode: 'Mobile', classe: '1ère Primaire' }
                ]
            },
            pedagogie: {
                classes: ['1ère Maternelle', '2ème Maternelle', '3ème Maternelle', '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'],
                eleves: [
                    { nom: 'Leki Marc', classe: '1ère Primaire', paye: 150 },
                    { nom: 'Kabea Sarah', classe: '1ère Maternelle', paye: 400 }
                ],
                nouvellesInscriptions: [
                    { id: 'REG-001', nom: 'Nkole Jonathan', classe: '1ère Primaire', date: '2026-06-28', statut: 'En attente' }
                ]
            },
            comms: { smsEnvoyes: 800, whatsappEnvoyes: 200 }
        },
        Retrouvailles: {
            finance: {
                revenus: 25000,
                depenses: 8000,
                fraisScolaires: [
                    { classe: '7ème EB', montant: 190 }, { classe: '8ème EB', montant: 190 },
                    { classe: '1ère Humanités', montantTech: 200, montantNonTech: 190 },
                    { classe: '2ème Humanités', montantTech: 200, montantNonTech: 190 },
                    { classe: '3ème Humanités', montantTech: 200, montantNonTech: 190 },
                    { classe: '4ème Humanités', montantTech: 230, montantNonTech: 200 }
                ],
                recentPayments: [
                    { id: '201', student: 'Baya Paul', amount: 90, date: '2026-06-24', motif: 'Frais Scolaires', mode: 'Caisse', classe: '7ème EB' }
                ]
            },
            pedagogie: {
                classes: ['7ème EB', '8ème EB', '1ère Humanités', '2ème Humanités', '3ème Humanités', '4ème Humanités'],
                sections: ['Technique', 'Non Technique'],
                optionsTech: ['Commerciale et Gestion', 'Secrétariat-Bureautique', 'Informatique de Gestion', 'Électricité', 'Mécanique Générale', 'Construction', 'Électronique', 'Nutrition-Alimentation', 'Puériculture', 'Coupe et Couture', 'Esthétique', 'Nursing (Soins Infirmiers)', 'Accoucheuse', 'Agriculture', 'Élevage', 'Pêche et Pisciculture'],
                optionsNonTech: ['Math-Physique', 'Chimie-Biologie', 'Latin-Philosophie', 'Histoire-Géo-Socio-Économie', 'Pédagogie Générale'],
                eleves: [
                    { nom: 'Baya Paul', classe: '7ème EB', paye: 90 },
                    { nom: 'Tshilanda Alice', classe: '1ère Humanités', paye: 0, section: 'Non Technique', option: 'Chimie-Biologie' }
                ],
                nouvellesInscriptions: [
                    { id: 'REG-002', nom: 'Kabongo Merveille', classe: '1ère Humanités', section: 'Scientifique', option: 'Chimie-Biologie', date: '2026-06-29', statut: 'En attente' }
                ]
            },
            comms: { smsEnvoyes: 450, whatsappEnvoyes: 150 }
        }
    },
    rh: {
        comptes: [
            { id: 1, nom: 'Mutombo', prenom: 'Patient', role: 'Direction', statut: 'Actif', ecole: 'Harmonie', email: 'patient.mutombo@harmonie.cd', classes: [], login: 'P.MUTOMBO' },
            { id: 2, nom: 'Kabila', prenom: 'Joëlle', role: 'Direction', statut: 'Actif', ecole: 'Retrouvailles', email: 'joelle.kabila@retrouvailles.cd', classes: [], login: 'J.KABILA' },
            { id: 3, nom: 'Baya', prenom: 'Paul', role: 'Enseignant', statut: 'Actif', ecole: 'Retrouvailles', email: 'paul.baya@retrouvailles.cd', classes: ['3ème Humanités (Math-Physique)', '2ème Humanités (Chimie-Bio)'], login: 'P.BAYA' },
            { id: 4, nom: 'Leki', prenom: 'Christine', role: 'Enseignant', statut: 'Actif', ecole: 'Harmonie', email: 'christine.leki@harmonie.cd', classes: ['1ère Primaire', '2ème Primaire'], login: 'C.LEKI' },
            { id: 5, nom: 'Nkole', prenom: 'Jean-Pierre', role: 'DP', statut: 'Actif', ecole: 'Harmonie', email: 'jp.nkole@harmonie.cd', classes: [], login: 'JP.NKOLE' },
            { id: 6, nom: 'Tshilanda', prenom: 'Marc', role: 'Préfet', statut: 'Actif', ecole: 'Retrouvailles', email: 'm.tshilanda@retrouvailles.cd', classes: [], login: 'M.TSHILANDA' },
            { id: 7, nom: 'Kabongo', prenom: 'Marie', role: 'Comptable', statut: 'Actif', ecole: 'Harmonie', email: 'marie.kabongo@harmonie.cd', classes: [], login: 'M.KABONGO' },
            { id: 8, nom: 'Ilunga', prenom: 'Robert', role: 'Sur école', statut: 'Actif', ecole: 'Harmonie', email: 'r.ilunga@harmonie.cd', classes: [], login: 'R.ILUNGA' },
            { id: 9, nom: 'Mbuyi', prenom: 'Sarah', role: 'D.E', statut: 'Actif', ecole: 'Retrouvailles', email: 's.mbuyi@retrouvailles.cd', classes: [], login: 'S.MBUYI' },
            { id: 10, nom: 'Kasongo', prenom: 'Luc', role: 'D.D', statut: 'Actif', ecole: 'Retrouvailles', email: 'l.kasongo@retrouvailles.cd', classes: [], login: 'L.KASONGO' }
        ],
        pointages: [
            { id: 1, nom: 'Mutombo Patient', date: '2026-07-13', statut: 'Présent', arrivee: '07:30', role: 'Direction', ecole: 'Harmonie', retardMin: 0 },
            { id: 2, nom: 'Kabila Joëlle', date: '2026-07-13', statut: 'Présent', arrivee: '07:45', role: 'Direction', ecole: 'Retrouvailles', retardMin: 0 },
            { id: 3, nom: 'Baya Paul', date: '2026-07-13', statut: 'Retard', arrivee: '08:25', role: 'Enseignant', ecole: 'Retrouvailles', retardMin: 25 },
            { id: 4, nom: 'Leki Christine', date: '2026-07-13', statut: 'Présent', arrivee: '07:55', role: 'Enseignant', ecole: 'Harmonie', retardMin: 0 },
            { id: 5, nom: 'Nkole Jean-Pierre', date: '2026-07-13', statut: 'Absent', arrivee: '—', role: 'Préfet', ecole: 'Harmonie', retardMin: 0 },
            { id: 6, nom: 'Tshilanda Marc', date: '2026-07-13', statut: 'Présent', arrivee: '07:40', role: 'Préfet', ecole: 'Retrouvailles', retardMin: 0 },
            { id: 7, nom: 'Kabongo Marie', date: '2026-07-13', statut: 'Présent', arrivee: '08:00', role: 'Comptable', ecole: 'Harmonie', retardMin: 0 },
            { id: 8, nom: 'Ilunga Robert', date: '2026-07-13', statut: 'Retard', arrivee: '08:18', role: 'Sur école', ecole: 'Harmonie', retardMin: 18 }
        ],
        journalDirection: [
            { id: 1, auteur: 'Mutombo Patient', role: 'Direction', action: 'Inscription approuvée', detail: 'Dossier REG-001 — Nkole Jonathan validé', heure: '09:15', date: '2026-07-13', ecole: 'Harmonie', type: 'success' },
            { id: 2, auteur: 'Kabila Joëlle', role: 'Direction', action: 'Connexion au système', detail: 'Accès depuis IP 192.168.1.14', heure: '07:48', date: '2026-07-13', ecole: 'Retrouvailles', type: 'info' },
            { id: 3, auteur: 'Mutombo Patient', role: 'Direction', action: 'Message envoyé aux parents', detail: 'Devoir de Math — 3ème Humanités (32 parents notifiés)', heure: '10:02', date: '2026-07-13', ecole: 'Harmonie', type: 'success' },
            { id: 4, auteur: 'Kabila Joëlle', role: 'Direction', action: 'Rapport de clôture', detail: 'Rapport journalier soumis pour validation', heure: '16:45', date: '2026-07-12', ecole: 'Retrouvailles', type: 'warning' },
            { id: 5, auteur: 'Mutombo Patient', role: 'Direction', action: 'Compte créé', detail: 'Nouveau compte Enseignant — Ilunga Robert', heure: '11:30', date: '2026-07-11', ecole: 'Harmonie', type: 'info' }
        ]
    },
    commsGlobal: { autoSmsRetard: true, autoWaRappel: true }
};

// ==========================================
// DB ENGINE
// ==========================================
let db;
try {
    let s = localStorage.getItem('admin_db');
    db = s ? JSON.parse(s) : defaultData;
    if (!db.version || db.version < DB_VERSION) { db = defaultData; localStorage.setItem('admin_db', JSON.stringify(db)); }
} catch (e) { db = defaultData; }
const saveDb = () => localStorage.setItem('admin_db', JSON.stringify(db));

// ==========================================
// CORE APP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem('hr_user'));

    // SECURITY CHECK 1: Must be authenticated
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // SECURITY CHECK 2: Strict RBAC - Only Super-Admin & Direction Générale can access Super-Admin dashboard (Finances & Configuration Globale)
    const isSuperAdmin = ['Super-Admin', 'Direction Générale'].includes(user.role);

    if (!isSuperAdmin) {
        // Direction Pédagogique & Discipline (D.P, Préfet, D.E, D.D, Sur École)
        if (['Préfet', 'D.E', 'D.D', 'Directeur (D.P)', 'D.P', 'Directeur', 'Sur École'].includes(user.role)) {
            alert(`ℹ️ REDIRECTION DIRECTION & PÉDAGOGIE\n\nBienvenue ${user.prenom} ${user.nom} (${user.role}).\nVous êtes redirigé vers votre Espace Officiel de Direction.`);
            window.location.href = '/prefet-dashboard.html';
            return;
        }
        // Enseignant & Personnel pédagogique
        if (['Enseignant', 'Professeur', 'Instituteur', 'Institutrice'].includes(user.role)) {
            alert(`ℹ️ REDIRECTION PÉDAGOGIQUE\n\nBienvenue ${user.prenom} ${user.nom} (${user.role}).\nVous êtes redirigé vers votre Espace Enseignant.`);
            window.location.href = '/teacher-dashboard.html';
            return;
        }
        // Comptable
        if (user.role === 'Comptable') {
            alert(`ℹ️ REDIRECTION COMPTABILITÉ\n\nBienvenue ${user.prenom} ${user.nom}.\nVous êtes redirigé vers votre Espace Comptabilité.`);
            window.location.href = '/compta-dashboard.html';
            return;
        }
        // Parent
        if (user.role === 'Parent') {
            alert(`⛔ ACCÈS REFUSÉ — SÉCURITÉ EPST\n\nUn compte parent ne peut pas accéder au système d'administration de l'école.\n\nVous êtes réorienté vers votre Espace Parent.`);
            window.location.href = '/parent-dashboard.html';
            return;
        }

        // Fallback for any unknown role: redirect to teacher or login without crash
        window.location.href = '/teacher-dashboard.html';
        return;
    }

    const ui = {
        name: document.getElementById('admin-name'),
        content: document.getElementById('main-content'),
        nav: document.querySelectorAll('.nav-item'),
        theme: document.getElementById('theme-toggle'),
        logout: document.getElementById('logout-btn')
    };

    if (ui.name) ui.name.textContent = `${user.prenom || ''} ${user.nom || ''}`;
    // Update avatar with real initials
    const avatarEl = document.querySelector('img[alt="User"]');
    if (avatarEl) {
        const initials = `${(user.prenom||'A')[0]}${(user.nom||'D')[0]}`;
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom+' '+user.nom)}&background=c7882c&color=fff&bold=true`;
    }
    // Show role badge
    const roleBadge = document.querySelector('p.text-xs.text-gold-600');
    if (roleBadge && user.role) roleBadge.textContent = user.role;

    const isGlobalSuperAdmin = user.role === 'Super-Admin';

    // PRIVACY & SECURITY: Hide financial and account management tabs for non-Super-Admin
    if (!isGlobalSuperAdmin) {
        const finNav = document.querySelector('a[data-target="finance"]');
        if (finNav) finNav.style.display = 'none';
        const comNav = document.querySelector('a[data-target="gestion-comptes"]');
        if (comNav) comNav.style.display = 'none';

        // Lock institution to user's assigned school
        if (user.ecole) {
            db.ecoleActive = user.ecole;
            saveDb();
        }
        const btnH = document.getElementById('switch-harmonie');
        const btnR = document.getElementById('switch-retrouvailles');
        if (user.ecole === 'Harmonie' && btnR) btnR.style.display = 'none';
        if (user.ecole === 'Retrouvailles' && btnH) btnH.style.display = 'none';
    }

    let currentView = 'dashboard';

    const renderView = () => {
        if (!ui.content) return;
        // Block non-super-admin if trying to access finance or accounts
        if (!isGlobalSuperAdmin && (currentView === 'finance' || currentView === 'gestion-comptes')) {
            currentView = 'dashboard';
        }
        switch (currentView) {
            case 'dashboard': renderDashboard(); break;
            case 'presence-journaliere': renderPresenceJournaliere(); break;
            case 'pedagogie': renderPedagogie(); break;
            case 'palmares': renderPalmares(); break;
            case 'resultats': renderResultats(); break;
            case 'rh': renderRH(); break;
            case 'finance': if (isGlobalSuperAdmin) renderFinance(); break;
            case 'communication': renderCommunication(); break;
            case 'coffrefort': renderCoffreFort(); break;
            case 'suivi-direction': renderSuiviDirection(); break;
            case 'dossier360': renderDossier360(); break;
            case 'gestion-comptes': if (isGlobalSuperAdmin) renderGestionComptes(); break;
        }
        if (window.lucide) lucide.createIcons();
        updateBadgePrevisions();
    };

    ui.nav.forEach(item => {
        item.onclick = () => {
            ui.nav.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.target;
            renderView();
        };
    });

    if (ui.theme) ui.theme.onclick = () => { document.documentElement.classList.toggle('dark'); renderView(); };
    if (ui.logout) ui.logout.onclick = () => { localStorage.removeItem('hr_user'); localStorage.removeItem('hr_token'); window.location.href = '/login.html'; };

    renderView();
    initInstitutionalSwitcher();

    function initInstitutionalSwitcher() {
        const btnH = document.getElementById('switch-harmonie');
        const btnR = document.getElementById('switch-retrouvailles');
        const updateHeader = () => {
            if (btnH && btnR) {
                btnH.className = db.ecoleActive === 'Harmonie' 
                    ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F]/80 border border-white/10 text-white shadow-sm transition-all" 
                    : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all";
                btnR.className = db.ecoleActive === 'Retrouvailles' 
                    ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F]/80 border border-white/10 text-white shadow-sm transition-all" 
                    : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all";
            }
            const logoEl = document.getElementById('admin-sidebar-logo');
            const nameEl = document.getElementById('admin-sidebar-school-name');
            const tagEl = document.getElementById('admin-sidebar-school-tag');
            if (logoEl) logoEl.src = db.ecoleActive === 'Harmonie' ? '/logos/logo-harmonie.png' : '/logos/logo-retrouvailles.png';
            if (nameEl) nameEl.textContent = db.ecoleActive === 'Harmonie' ? 'C.S. Harmonie' : 'G.S. Retrouvailles';
            if (tagEl) tagEl.textContent = db.ecoleActive === 'Harmonie' ? 'Maternelle & Primaire' : 'Secondaire & Humanités';
        };
        if (btnH) btnH.onclick = () => { if (isGlobalSuperAdmin || user.ecole === 'Harmonie') { db.ecoleActive = 'Harmonie'; saveDb(); updateHeader(); renderView(); } };
        if (btnR) btnR.onclick = () => { if (isGlobalSuperAdmin || user.ecole === 'Retrouvailles') { db.ecoleActive = 'Retrouvailles'; saveDb(); updateHeader(); renderView(); } };
        updateHeader();
    }

    // ==========================================
    // RENDER: DASHBOARD
    // ==========================================
    function renderDashboard() {
        const inst = db.institutions[db.ecoleActive];
        const allPointages = db.rh.pointages.filter(p => p.ecole === db.ecoleActive);
        const presenceRate = allPointages.length > 0 ? Math.round((allPointages.filter(p => p.statut === 'Présent').length / allPointages.length) * 100) : 0;
        const solde = inst.finance.revenus - inst.finance.depenses;
        const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const isGS = db.ecoleActive === 'Retrouvailles';

        const retardsList = allPointages.filter(p => p.statut === 'Retard');
        const retardsCount = retardsList.length;
        const presentsCount = allPointages.filter(p => p.statut === 'Présent' || p.statut === 'Terminé').length;
        const absentsCount = allPointages.filter(p => p.statut === 'Absent').length;

        const allEleves = JSON.parse(localStorage.getItem('hr_eleves_db')) || [];
        const elevesInst = allEleves.filter(e => e.ecole === db.ecoleActive && e.statut !== 'Rejeté');
        const countInscrits = elevesInst.length > 0 ? elevesInst.length : inst.pedagogie.eleves.length;

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-start">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tight">${isGlobalSuperAdmin ? 'Tableau de Bord ERP' : (db.ecoleActive === 'Harmonie' ? 'Direction École Primaire' : 'Direction Pédagogique')}</h2>
                    <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">${db.ecoleActive} — ${today}</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-xs font-black text-emerald-400 uppercase tracking-widest">${user.role} Actif</span>
                </div>
            </div>

            <!-- KPI Grid -->
            <div id="widgets" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                ${isGlobalSuperAdmin ? `
                    ${createKPI('Recettes Totales', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-emerald-500', 'bg-emerald-500/10')}
                    ${createKPI('Dépenses', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-400', 'bg-red-500/10')}
                    ${createKPI('Solde Net', `$${solde.toLocaleString()}`, 'wallet', 'text-amber-400', 'bg-amber-500/10')}
                    ${createKPI('Effectif Total', countInscrits, 'users', 'text-blue-400', 'bg-blue-500/10')}
                ` : `
                    ${createKPI('Élèves Inscrits', countInscrits, 'users', 'text-emerald-400', 'bg-emerald-500/10')}
                    ${createKPI('Classes Actives', inst.pedagogie.classes.length, 'school', 'text-blue-400', 'bg-blue-500/10')}
                    ${createKPI('Personnel Actif', allPointages.length || 18, 'user-check', 'text-amber-400', 'bg-amber-500/10')}
                    ${createKPI('Taux de Présence', `${presenceRate}%`, 'check-circle-2', 'text-purple-400', 'bg-purple-500/10')}
                `}
            </div>

            <!-- Secondary KPIs -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center"><i data-lucide="user-check" class="w-6 h-6 text-cyan-400"></i></div>
                    <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Présents ce jour</p><h4 class="text-2xl font-black text-white">${presentsCount}</h4></div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-4 relative overflow-hidden">
                    <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><i data-lucide="clock-alert" class="w-6 h-6 text-amber-400 animate-pulse"></i></div>
                    <div>
                        <p class="text-[10px] font-black text-amber-400 uppercase tracking-widest">Nombre de Retards</p>
                        <h4 class="text-2xl font-black text-amber-400">${retardsCount} <span class="text-xs font-normal text-gray-400">agent(s)</span></h4>
                    </div>
                    ${retardsCount > 0 ? '<span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>' : ''}
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center"><i data-lucide="user-x" class="w-6 h-6 text-rose-400"></i></div>
                    <div><p class="text-[10px] font-black text-rose-400 uppercase tracking-widest">Absences</p><h4 class="text-2xl font-black text-white">${absentsCount}</h4></div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center"><i data-lucide="school" class="w-6 h-6 text-purple-400"></i></div>
                    <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sections / Options</p><h4 class="text-2xl font-black text-white">${inst.pedagogie.classes.length}</h4></div>
                </div>
            </div>

            <!-- Charts + Activity Feed -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                ${isGlobalSuperAdmin ? `
                    <div class="lg:col-span-2 glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
                        <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4">Évolution Financière ${new Date().getFullYear()}</h3>
                        <div id="chartRev" class="h-64"></div>
                    </div>
                ` : `
                    <div class="lg:col-span-2 glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
                        <h3 class="font-black text-sm uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                            <i data-lucide="award" class="w-4 h-4"></i> Répartition & Assiduité Pédagogique
                        </h3>
                        <div class="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                            <div class="flex justify-between items-center text-sm font-bold">
                                <span>Assiduité des Élèves</span>
                                <span class="text-emerald-400">96.4%</span>
                            </div>
                            <div class="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style="width: 96.4%"></div>
                            </div>
                            <div class="flex justify-between items-center text-sm font-bold pt-2">
                                <span>Couverture du Programme National (EPST)</span>
                                <span class="text-blue-400">82.0%</span>
                            </div>
                            <div class="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style="width: 82%"></div>
                            </div>
                        </div>
                    </div>
                `}
                <div class="glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
                    <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4">Répartition des Élèves</h3>
                    <div id="chartPed" class="h-64"></div>
                </div>
            </div>
                <div class="glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
                    <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4">Répartition des Élèves</h3>
                    <div id="chartPed" class="h-64"></div>
                </div>
            </div>

            <!-- RAPPORT DE PRÉSENCE JOURNALIÈRE DU SUPER-ADMIN (PRO) -->
            <div class="glass-panel p-8 rounded-3xl shadow-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0A192F]/90 to-[#112240]/80 mb-8 relative overflow-hidden">
                <div class="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <i data-lucide="scan-face" class="w-7 h-7"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-xl font-black text-white uppercase tracking-tight">Rapport de Présence Journalière</h3>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">Live IA</span>
                            </div>
                            <p class="text-xs text-gray-400 mt-0.5">Registre officiel certifié par Reconnaissance Faciale & Biométrie • ${today}</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-3">
                        <button onclick="window.openPresenceScanner ? window.openPresenceScanner() : alert('Module scanner en cours')" 
                            class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
                            <i data-lucide="camera" class="w-4 h-4"></i> Scanner Présence
                        </button>
                        <button onclick="printDailyPresenceReport('${db.ecoleActive}')" 
                            class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/10 transition">
                            <i data-lucide="printer" class="w-4 h-4 text-emerald-400"></i> Imprimer Rapport Officiel
                        </button>
                        <button onclick="exportPresenceCSV('${db.ecoleActive}')" 
                            class="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs flex items-center gap-2 border border-white/5 transition">
                            <i data-lucide="download" class="w-4 h-4 text-cyan-400"></i> Exporter CSV
                        </button>
                    </div>
                </div>

                <!-- ALERTE RETARDATAIRES DU JOUR (SI > 0) -->
                ${retardsCount > 0 ? `
                    <div class="p-4 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 animate-fade-in">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h5 class="text-sm font-black text-amber-400 uppercase tracking-wide">
                                    Attention : ${retardsCount} Retard${retardsCount > 1 ? 's' : ''} Détecté${retardsCount > 1 ? 's' : ''} ce matin
                                </h5>
                                <p class="text-xs text-gray-300 mt-0.5">
                                    ${retardsList.map(r => `<strong>${r.nom}</strong> (${r.arrivee}${r.retardMin ? ` +${r.retardMin}m` : ''})`).join(', ')}
                                </p>
                            </div>
                        </div>
                        <button onclick="alert('Notification SMS de rappel envoyée à tous les retardataires du jour (${retardsCount} agents)')" 
                            class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition">
                            <i data-lucide="send" class="w-3.5 h-3.5"></i> Alerter par SMS
                        </button>
                    </div>
                ` : ''}

                <!-- Live Presence Summary Metrics -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                        <div>
                            <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Présents (Pointés)</p>
                            <h4 class="text-2xl font-black text-white mt-1">${presentsCount}</h4>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
                            ${allPointages.length > 0 ? Math.round((presentsCount / allPointages.length) * 100) : 0}%
                        </div>
                    </div>
                    <div class="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-between shadow-lg shadow-amber-500/10">
                        <div>
                            <p class="text-[10px] font-black text-amber-300 uppercase tracking-widest">Nombre de Retards</p>
                            <h4 class="text-3xl font-black text-amber-400 mt-1">${retardsCount}</h4>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 font-black">
                            <i data-lucide="clock" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                        <div>
                            <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest">Absents</p>
                            <h4 class="text-2xl font-black text-white mt-1">${absentsCount}</h4>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                            <i data-lucide="user-x" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                        <div>
                            <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Effectif Total</p>
                            <h4 class="text-2xl font-black text-white mt-1">${allPointages.length}</h4>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                    </div>
                </div>

                <!-- Table of Today's Presence Records -->
                <div class="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
                    <table class="w-full text-left" id="dashboard-presence-table">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10 bg-white/5">
                            <tr>
                                <th class="py-3.5 px-4">Agent / Personnel</th>
                                <th class="py-3.5 px-4">Fonction / Rôle</th>
                                <th class="py-3.5 px-4">Heure d'Arrivée</th>
                                <th class="py-3.5 px-4">Méthode de Scan</th>
                                <th class="py-3.5 px-4">Statut d'Assiduité</th>
                                <th class="py-3.5 px-4 text-right">Action Direction</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5 text-sm">
                            ${allPointages.length === 0 ? `
                                <tr>
                                    <td colspan="6" class="text-center py-8 text-gray-400 text-xs italic">
                                        Aucun pointage enregistré pour le moment aujourd'hui.
                                    </td>
                                </tr>
                            ` : allPointages.map(p => {
                                const isLate = p.statut === 'Retard';
                                const isAbsent = p.statut === 'Absent';
                                const statusClass = isAbsent 
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                                    : (isLate 
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30');
                                const roleColorsMap = {
                                    'Direction': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Directeur Général': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Enseignant': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                                    'Préfet': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                                    'Comptable': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                };
                                const roleBadge = roleColorsMap[p.role] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
                                
                                return `
                                    <tr class="hover:bg-white/5 transition-colors ${isLate ? 'bg-amber-500/5' : ''}">
                                        <td class="py-3 px-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xs shadow-inner">
                                                    ${p.nom.split(' ').map(n=>n[0]).join('').slice(0,2)}
                                                </div>
                                                <div>
                                                    <p class="font-bold text-white leading-tight">${p.nom}</p>
                                                    <p class="text-[10px] text-gray-400">${db.ecoleActive}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleBadge}">
                                                ${p.role || 'Personnel'}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 font-mono font-bold ${isAbsent ? 'text-gray-500' : isLate ? 'text-amber-400' : 'text-emerald-300'}">
                                            <div class="flex items-center gap-1.5">
                                                <i data-lucide="${isLate ? 'clock-alert' : 'clock'}" class="w-3.5 h-3.5 ${isLate ? 'text-amber-400' : 'text-gray-400'}"></i>
                                                ${p.arrivee || '—'}
                                                ${isLate && p.retardMin ? `<span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">+${p.retardMin}m</span>` : ''}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-cyan-300">
                                                <i data-lucide="scan-face" class="w-3 h-3 text-cyan-400"></i> Facial IA
                                            </span>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide inline-flex items-center gap-1.5 ${statusClass}">
                                                <span class="w-1.5 h-1.5 rounded-full ${isAbsent ? 'bg-rose-400' : isLate ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
                                                ${p.statut}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-right">
                                            <button onclick="alert('Pointage de ${p.nom} : Arrivée à ${p.arrivee} (${p.statut})')" 
                                                class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white border border-white/10 transition">
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- EPST-Specific: Classes Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${isGlobalSuperAdmin ? `
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4 text-amber-400"></i> Grille des Frais EPST</h3>
                        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                            ${inst.finance.fraisScolaires.map(f => `
                                <div class="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                                    <span class="text-xs font-bold text-gray-300">${f.classe}</span>
                                    <span class="text-sm font-black text-amber-400">${f.montant !== undefined ? '$' + f.montant : '$' + f.montantNonTech + ' / $' + f.montantTech}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 class="font-black text-sm uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2"><i data-lucide="school" class="w-4 h-4 text-emerald-400"></i> Classes & Sections Actives (${db.ecoleActive})</h3>
                        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                            ${inst.pedagogie.classes.map(c => `
                                <div class="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                                    <span class="text-xs font-bold text-gray-200">${c}</span>
                                    <span class="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Enseignement Officiel</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `}
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-blue-400"></i> Dernières Activités</h3>
                    <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
                        ${db.rh.journalDirection.filter(j => j.ecole === db.ecoleActive).slice(0, 5).map(j => `
                            <div class="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                                <div class="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-black shrink-0">${j.auteur[0]}</div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-white truncate">${j.action}</p>
                                    <p class="text-[10px] text-gray-400 mt-0.5">${j.detail}</p>
                                    <p class="text-[9px] text-gray-500 mt-0.5 font-mono">${j.heure} — ${j.date}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        setTimeout(initDashboardCharts, 100);
        if (window.dragula) dragula([document.getElementById('widgets')]);
    }

    // ==========================================
    // RENDER: FINANCE (DUAL GATEWAY)
    // ==========================================
    function renderFinance() {
        const inst = db.institutions[db.ecoleActive];
        const hasSec = db.ecoleActive === 'Retrouvailles';

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Finance & Gestion de Caisse</h2>
                    <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} - Pôle Financier v3.0</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <!-- PAYMENT TERMINAL -->
                <div class="xl:col-span-2 glass-panel p-10 rounded-[2.5rem] shadow-2xl relative border border-white/20">
                    
                    <!-- DUAL GATEWAY CHOICE -->
                    <div class="flex bg-white/10 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-10 w-fit shadow-inner">
                        <button id="tabM" class="px-8 py-3 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-700 shadow-md text-brand-600 scale-105">Mobile Money</button>
                        <button id="tabC" class="px-8 py-3 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700">Caisse (Présentiel)</button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div class="lg:col-span-3 space-y-8">
                            
                            <!-- Shared Fields -->
                            <div class="space-y-4">
                                <div><label class="premium-label">Nom de l'élève *</label>
                                    <select id="stdSel" class="premium-select">
                                        <option value="" disabled selected>Choisir un élève...</option>
                                        ${inst.pedagogie.eleves.map(e => `<option value="${e.nom}">${e.nom}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label class="premium-label">Classe Sollicitée *</label>
                                        <select id="clsSel" class="premium-select">
                                            <option value="" disabled selected>Sélectionner...</option>
                                            ${inst.pedagogie.classes.map(c => `<option value="${c}">${c}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div id="boxSection" class="${hasSec ? '' : 'hidden'}">
                                        <label class="premium-label">Section (Famille) *</label>
                                        <select id="secSel" class="premium-select">
                                            <option value="" selected>Choisir Section...</option>
                                            ${hasSec ? inst.pedagogie.sections.map(s => `<option value="${s}">${s}</option>`).join('') : ''}
                                        </select>
                                    </div>
                                </div>
                                <div id="boxOption" class="hidden">
                                    <label class="premium-label">Option Spécifique *</label>
                                    <select id="optSel" class="premium-select">
                                        <option value="" selected>Choisir Option...</option>
                                        <!-- Dynamic load block -->
                                    </select>
                                </div>
                            </div>

                            <!-- Motif (Always visible now) -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    <label class="premium-label">Motif du Paiement *</label>
                                    <select id="motiveSel" class="premium-select font-bold text-brand-700">
                                        <option value="Frais Scolaires">Frais Scolaires</option>
                                        <option value="Frais Connexes">Frais Connexes (Non fixé)</option>
                                        <option value="Fournitures">Fournitures (Non fixé)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Mobile Money Specific -->
                            <div id="mFields" class="grid grid-cols-2 gap-4 animate-fade-in">
                                <div><label class="premium-label">Opérateur</label><select class="premium-select"><option>M-Pesa</option><option>Airtel Money</option><option>Orange Money</option></select></div>
                                <div><label class="premium-label">Numéro Tél</label><input type="text" placeholder="+243..." class="premium-input"></div>
                            </div>

                            <!-- Cash Specific -->
                            <div id="cFields" class="hidden animate-fade-in">
                                <div class="p-4 bg-[#112240]/50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl text-xs text-gray-500 font-medium">
                                    Paiement manuel enregistré à la caisse.
                                </div>
                            </div>

                            <!-- Amount -->
                            <div class="space-y-4">
                                <div><label class="premium-label text-brand-600 font-black">Montant Total à Payer (USD)</label>
                                    <div class="relative">
                                        <span class="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">$</span>
                                        <input id="amtInp" type="number" placeholder="0.00" class="premium-input pl-12 text-3xl font-black text-brand-600">
                                    </div>
                                </div>
                                <button id="valBtn" class="premium-btn w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3">VALIDER TRANSACTION</button>
                            </div>
                        </div>

                        <!-- Sidebar Summary -->
                        <div class="lg:col-span-2">
                            <div class="bg-[#112240]/50 dark:bg-gray-800/50 rounded-[2.5rem] p-10 border dark:border-gray-700 shadow-inner h-full flex flex-col justify-between">
                                <div>
                                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Résumé du Dossier</h4>
                                    <div class="space-y-6">
                                        <div class="flex justify-between border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs text-gray-400">Total Annuel</span><span id="txtT" class="font-bold">$ 0</span></div>
                                        <div class="flex justify-between border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs text-gray-400">Déjà Versé</span><span id="txtP" class="font-bold text-green-500">$ 0</span></div>
                                    </div>
                                </div>
                                <div class="pt-10">
                                    <span class="text-orange-500 font-black text-[10px] uppercase tracking-widest">Reste à payer</span>
                                    <div id="txtB" class="text-5xl font-black text-orange-600 tracking-tighter mt-2">$ 0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE: Tarifs et Clôture -->
                <div class="space-y-8">
                    <!-- Clôture de Caisse Panel -->
                    <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#112240]/80/10 rounded-full blur-2xl"></div>
                        <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Opérations du Jour</h3>
                        <div class="text-3xl font-black tracking-tighter mb-6">$${inst.finance.revenus.toLocaleString()} <span class="text-xs text-brand-400 uppercase tracking-widest font-bold block mt-1">+ Encaissés Aujourd'hui</span></div>
                        <button onclick="alert('Rapport de clôture hautement sécurisé généré et envoyé à la direction.')" class="w-full py-4 bg-[#112240]/80 text-gray-900 font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <i data-lucide="lock" class="w-4 h-4"></i> Clôturer la Caisse
                        </button>
                    </div>

                    <!-- Panel Tarifs -->
                    <div class="glass-panel p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                        <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 flex justify-between">Tarification Officielle <i data-lucide="shield-check" class="w-3 h-3 text-brand-500"></i></h3>
                        <div class="space-y-3">
                            ${inst.finance.fraisScolaires.map(f => `
                                <div class="p-4 bg-[#112240]/50 dark:bg-gray-800/80 rounded-2xl flex justify-between items-center hover:bg-brand-50 transition-all cursor-pointer border border-transparent hover:border-brand-100">
                                    <span class="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase">${f.classe}</span>
                                    <span class="text-sm font-black text-brand-600">$${f.montant !== undefined ? f.montant : `${f.montantNonTech} - $${f.montantTech}`}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- HISTORY & PROGRESS BARS -->
                <div class="xl:col-span-3 glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/10 mt-4">
                    <div class="flex justify-between items-end mb-10">
                        <div>
                            <h3 class="font-black text-2xl uppercase tracking-tighter">Historique & Tranches</h3>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Audit visuel des recouvrements</p>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b dark:border-gray-700 opacity-60">
                                <tr><th class="pb-6">TRX ID</th><th class="pb-6">Élève & Motif</th><th class="pb-6 w-1/4">Échéancier (Progression)</th><th class="pb-6">Mode</th><th class="pb-6 text-right">Montant (USD)</th><th class="pb-6 text-center">Reçu</th></tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                                ${inst.finance.recentPayments.map(p => {
            // Calcul dynamique du pourcentage si c'est un minerval
            let progUI = `<span class="text-[10px] text-gray-400 italic">Libre</span>`;
            if (p.motif === 'Frais Scolaires') {
                const stu = inst.pedagogie.eleves.find(e => e.nom === p.student);
                const fee = inst.finance.fraisScolaires.find(f => f.classe === p.classe);
                let tot = 0;
                if (fee) {
                    if (fee.montant !== undefined) tot = fee.montant;
                    else {
                        const isTechHist = (p.section === 'Technique' || (stu && stu.section === 'Technique'));
                        tot = isTechHist ? fee.montantTech : fee.montantNonTech;
                    }
                }
                if (tot > 0 && stu) {
                    let pct = Math.min(100, Math.round((stu.paye / tot) * 100));
                    let color = pct < 40 ? 'bg-red-500' : (pct < 100 ? 'bg-orange-400' : 'bg-brand-500');
                    progUI = `
                                                <div class="w-full flex items-center gap-3">
                                                    <div class="flex-1 bg-white/10 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                        <div class="${color} h-full rounded-full transition-all duration-1000" style="width: ${pct}%"></div>
                                                    </div>
                                                    <span class="text-[9px] font-black uppercase text-gray-500 w-8 text-right">${pct}%</span>
                                                </div>
                                            `;
                }
            }

            return `
                                    <tr class="hover:bg-[#112240]/50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td class="py-5 font-mono text-[11px] text-gray-400">#${p.id}</td>
                                        <td class="py-5">
                                            <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">${p.student}</div>
                                            <div class="text-[10px] text-gray-400 mt-1 uppercase font-bold flex gap-2 items-center">
                                                <span class="px-1.5 py-0.5 rounded bg-white/10 dark:bg-gray-700">${p.motif || 'N/A'}</span> • ${p.date}
                                            </div>
                                        </td>
                                        <td class="py-5 pr-8">
                                            ${progUI}
                                        </td>
                                        <td class="py-5">
                                            <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border ${p.mode === 'Mobile' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-[#112240]/50 text-gray-700 border-gray-200'}">
                                                ${p.mode}
                                            </span>
                                        </td>
                                        <td class="py-5 text-right font-black text-brand-600 text-2xl font-display tracking-tighter">+$${p.amount}</td>
                                        <td class="py-5 text-center">
                                            <button class="p-2.5 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm" title="Imprimer Ticket Thermique" onclick="window.print()">
                                                <i data-lucide="printer" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>`
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        initFinanceLogic();
    }

    function initFinanceLogic() {
        const inst = db.institutions[db.ecoleActive];
        const tM = document.getElementById('tabM'), tC = document.getElementById('tabC');
        const bM = document.getElementById('mFields'), bC = document.getElementById('cFields');
        const sS = document.getElementById('stdSel'), sC = document.getElementById('clsSel');
        const sSec = document.getElementById('secSel'), sOpt = document.getElementById('optSel');
        const mSel = document.getElementById('motiveSel');
        let mode = 'Mobile';

        const updateSummary = () => {
            let classeCible = sC && sC.value ? sC.value : '';
            let secCible = sSec && sSec.value ? sSec.value : '';

            const stu = inst.pedagogie.eleves.find(e => e.nom === sS.value);
            let paye = stu ? stu.paye : 0;

            let totalAttribue = 0;
            let displayT = "Non Fixé";
            let displayB = "Non Fixé";

            if (mSel && mSel.value === 'Frais Scolaires' && classeCible) {
                const fee = inst.finance.fraisScolaires.find(f => f.classe === classeCible);
                if (fee) {
                    if (fee.montant !== undefined) {
                        totalAttribue = fee.montant;
                    } else if (fee.montantTech !== undefined) {
                        // Strict check for Technical Section from the dropdown manually
                        const isTech = (secCible === 'Technique');
                        totalAttribue = isTech ? fee.montantTech : fee.montantNonTech;
                    }
                    displayT = `$ ${totalAttribue}`;
                    displayB = `$ ${Math.max(0, totalAttribue - paye)}`;
                } else {
                    displayT = "Vérifiez classe";
                }
            } else {
                totalAttribue = 0; // Means non-fixed amount
            }

            if (document.getElementById('txtT')) document.getElementById('txtT').textContent = displayT;
            if (document.getElementById('txtP')) document.getElementById('txtP').textContent = (mSel && mSel.value === 'Frais Scolaires') ? `$ ${paye}` : `$ 0`;
            if (document.getElementById('txtB')) document.getElementById('txtB').textContent = displayB;

            toggleAcademicFields(classeCible);
        };

        const onStudentChange = () => {
            const stu = inst.pedagogie.eleves.find(e => e.nom === sS.value);
            if (stu) {
                if (sC) sC.value = stu.classe || '';
                if (sSec) sSec.value = stu.section || '';
                if (sOpt) sOpt.value = stu.option || '';
            }
            updateSummary();
        };

        const toggleAcademicFields = (cls) => {
            const bSec = document.getElementById('boxSection'), bOpt = document.getElementById('boxOption');
            if (db.ecoleActive === 'Retrouvailles' && cls && cls.includes('Humanités')) {
                if (bSec) bSec.classList.remove('hidden');
                if (bOpt) bOpt.classList.remove('hidden');

                // Dynamic options
                if (sSec && sOpt) {
                    let val = sSec.value;
                    let opts = val === 'Technique' ? inst.pedagogie.optionsTech : (val === 'Non Technique' ? inst.pedagogie.optionsNonTech : []);
                    let current = sOpt.value;
                    sOpt.innerHTML = '<option value="" selected>Choisir Option...</option>' + opts.map(o => `<option value="${o}">${o}</option>`).join('');
                    if (opts.includes(current)) sOpt.value = current;
                }
            } else {
                if (bSec) bSec.classList.add('hidden');
                if (bOpt) bOpt.classList.add('hidden');
            }
        };

        if (sS) sS.onchange = onStudentChange;
        if (sC) sC.onchange = (e) => { toggleAcademicFields(e.target.value); updateSummary(); };
        if (sSec) sSec.onchange = (e) => { toggleAcademicFields(sC ? sC.value : ''); updateSummary(); };
        if (mSel) mSel.onchange = updateSummary;

        if (tM && tC) {
            tM.onclick = () => { mode = 'Mobile'; bM.classList.remove('hidden'); bC.classList.add('hidden'); tM.className = 'active-tab-momo'; tC.className = 'inactive-tab'; };
            tC.onclick = () => { mode = 'Caisse'; bC.classList.remove('hidden'); bM.classList.add('hidden'); tC.className = 'active-tab-caisse'; tM.className = 'inactive-tab'; };
        }

        const vBtn = document.getElementById('valBtn');
        if (vBtn) {
            vBtn.onclick = () => {
                const name = sS.value, amt = parseFloat(document.getElementById('amtInp').value), cls = sC.value;
                if (!name || isNaN(amt) || !cls) return alert('Détails de paiement requis (Élève, Classe, Montant) !');

                const stu = inst.pedagogie.eleves.find(e => e.nom === name);
                vBtn.disabled = true; vBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-5 h-5"></i>';
                lucide.createIcons();

                setTimeout(() => {
                    const motifText = mSel ? mSel.value : 'Frais Scolaires';
                    const tx = { id: Math.floor(Math.random() * 9000 + 1000), student: name, amount: amt, mode, date: new Date().toLocaleDateString(), classe: cls, section: sSec?.value, option: sOpt?.value, motif: motifText };
                    inst.finance.recentPayments.unshift(tx);
                    inst.finance.revenus += amt;

                    if (motifText === 'Frais Scolaires') {
                        stu.paye += amt; // Add to existing payments if minerval
                    }

                    saveDb();

                    // compute remains for receipt
                    let resteText = "Non applicable";
                    if (motifText === 'Frais Scolaires') {
                        const fee = inst.finance.fraisScolaires.find(f => f.classe === cls);
                        let tot = 0;
                        if (fee) {
                            if (fee.montant !== undefined) tot = fee.montant;
                            else {
                                const isTech = (tx.section === 'Technique');
                                tot = isTech ? fee.montantTech : fee.montantNonTech;
                            }
                        }
                        resteText = `$${Math.max(0, tot - stu.paye)}`;
                    }

                    renderView();
                    showReceipt({ ...tx, reste: resteText });
                }, 1500);
            };
        }
    }

    function showReceipt(d) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;
        modal.classList.remove('hidden');

        let elDate = document.getElementById('r-date');
        let elId = document.getElementById('r-id');

        if (elDate) elDate.textContent = d.date;
        if (elId) elId.textContent = `#TXN-${d.id}`;

        // Handle qr code logic
        const qr = document.getElementById('r-qrcode');
        if (qr && window.QRCode) { qr.innerHTML = ''; new QRCode(qr, { text: `OK:${d.student}-${d.amount}`, width: 80, height: 80 }); }
    }

    // Modal close
    const clsRec = document.getElementById('close-receipt');
    if (clsRec) clsRec.onclick = () => document.getElementById('receipt-modal').classList.add('hidden');
    const prtRec = document.getElementById('print-receipt');
    if (prtRec) prtRec.onclick = () => window.print();

    // ==========================================
    // HELPERS
    // ==========================================
    function initDashboardCharts() {
        if (!window.ApexCharts) return;
        const inst = db.institutions[db.ecoleActive], isD = document.documentElement.classList.contains('dark');
        const elRev = document.getElementById('chartRev');
        if (elRev) {
            new ApexCharts(elRev, {
                series: [{ name: 'Recettes', data: [15, 30, 25, 55, 40, inst.finance.revenus / 1000] }],
                chart: { type: 'area', height: 320, toolbar: { show: false } }, colors: ['#22c55e'], theme: { mode: isD ? 'dark' : 'light' }
            }).render();
        }
        const elPed = document.getElementById('chartPed');
        if (elPed) {
            new ApexCharts(elPed, {
                series: db.ecoleActive === 'Harmonie' ? [45, 55] : [40, 35, 25],
                chart: { type: 'donut', height: 320 }, labels: db.ecoleActive === 'Harmonie' ? ['Maternelle', 'Primaire'] : ['Éducation de Base', 'Humanités Scientifiques', 'Humanités Techniques'], theme: { mode: isD ? 'dark' : 'light' }
            }).render();
        }
    }

    function createKPI(t, v, i, c, b) {
        return `<div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:translate-y-[-3px] transition-all cursor-move border border-white/10">
            <div class="w-12 h-12 rounded-xl ${b} ${c} flex items-center justify-center shrink-0"><i data-lucide="${i}" class="w-6 h-6"></i></div>
            <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">${t}</p><h4 class="text-2xl font-black dark:text-white">${v}</h4></div>
        </div>`;
    }

    // ==========================================
    // HELPERS PEDAGOGIQUES
    // ==========================================
    function getAllPrevisionsMeta() {
        // Reads all prevision_meta_* keys from localStorage to aggregate teacher submissions
        const allKeys = Object.keys(localStorage).filter(k => k.startsWith('prevision_meta_'));
        return allKeys.map(k => {
            try { return { key: k.replace('prevision_meta_', ''), ...JSON.parse(localStorage.getItem(k)) }; }
            catch(e) { return null; }
        }).filter(Boolean);
    }

    function getAllCotations() {
        // Reads all cotations_* keys from localStorage
        const allKeys = Object.keys(localStorage).filter(k => k.startsWith('cotations_'));
        return allKeys.map(k => {
            try { return { enseignant: k.replace('cotations_', ''), notes: JSON.parse(localStorage.getItem(k)) }; }
            catch(e) { return null; }
        }).filter(Boolean);
    }

    function getAllPrevisionData(login) {
        try { return JSON.parse(localStorage.getItem('prevision_' + login)) || {}; }
        catch(e) { return {}; }
    }

    function updateBadgePrevisions() {
        const metas = getAllPrevisionsMeta();
        const pending = metas.filter(m => m.statut === 'soumis').length;
        const badge = document.getElementById('badge-previsions');
        if (badge) {
            badge.textContent = pending;
            badge.classList.toggle('hidden', pending === 0);
        }
    }

    function mentionFromPct(pct) {
        if (pct >= 80) return { label: 'Très Bien', css: 'text-emerald-400', icon: '🏆' };
        if (pct >= 70) return { label: 'Bien', css: 'text-green-400', icon: '👍' };
        if (pct >= 60) return { label: 'Satisfaisant', css: 'text-blue-400', icon: '✅' };
        if (pct >= 50) return { label: 'Passable', css: 'text-amber-400', icon: '⚠️' };
        return { label: 'Insuffisant', css: 'text-red-400', icon: '❌' };
    }

    let currentPedagogyTab = 'previsions';

    function renderPedagogie() {
        const inst = db.institutions[db.ecoleActive];
        const isRetro = db.ecoleActive === 'Retrouvailles';
        const schoolLogo = isRetro ? '/logos/logo-retrouvailles.png' : '/logos/logo-harmonie.png';
        const schoolName = isRetro ? 'G.S. Retrouvailles' : 'C.S. Harmonie';
        const schoolCycle = isRetro ? 'Enseignement Secondaire & Humanités' : 'Enseignement Maternelle & Primaire';
        const examName = isRetro ? 'EXETAT & TENASOSP' : 'ENAFEP';

        const allEleves = JSON.parse(localStorage.getItem('hr_eleves_db')) || [];
        const eleves = allEleves.filter(e => e.ecole === db.ecoleActive && e.statut !== 'Rejeté');
        const finalistes = isRetro 
            ? eleves.filter(e => (e.classe && (e.classe.includes('4ème') || e.classe.includes('8ème') || e.classe.includes('Humanité'))))
            : eleves.filter(e => (e.classe && e.classe.includes('6ème')));

        const enseignants = db.rh.comptes.filter(c => c.ecole === db.ecoleActive && c.role === 'Enseignant');
        const previsionsMeta = getAllPrevisionsMeta();
        const filteredMeta = previsionsMeta;

        // Stats
        const total = enseignants.length;
        const soumis = filteredMeta.filter(m => m.statut === 'soumis').length;
        const approuves = filteredMeta.filter(m => m.statut === 'approuve').length;
        const rejetes = filteredMeta.filter(m => m.statut === 'rejete').length;

        // Global functions
        window.switchPedagogyTab = function(tab) {
            currentPedagogyTab = tab;
            renderPedagogie();
        };

        window.approuverPrevision = function(login) {
            const key = 'prevision_meta_' + login;
            try {
                const meta = JSON.parse(localStorage.getItem(key)) || {};
                meta.statut = 'approuve';
                meta.dateValidation = new Date().toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'});
                localStorage.setItem(key, JSON.stringify(meta));
            } catch(e) {}
            renderPedagogie();
        };

        window.rejeterPrevision = function(login) {
            const commentaire = prompt('Motif de rejet (optionnel) :');
            const key = 'prevision_meta_' + login;
            try {
                const meta = JSON.parse(localStorage.getItem(key)) || {};
                meta.statut = 'rejete';
                meta.commentaireDirection = commentaire || '';
                meta.dateValidation = new Date().toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'});
                localStorage.setItem(key, JSON.stringify(meta));
            } catch(e) {}
            renderPedagogie();
        };

        window.voirPrevision = function(login) {
            const meta = getAllPrevisionsMeta().find(m => m.key === login) || {};
            const data = getAllPrevisionData(login);
            const filled = Object.keys(data).filter(k => k.endsWith('_chapitres') && data[k]).length;
            alert(`📋 PRÉVISION DE ${(meta.key||login).toUpperCase()}\n\nMatière : ${meta.matiere || '—'}\nClasse : ${meta.classe || '—'}\nVolume horaire : ${meta.volumeHoraire || '—'}\nSemaines remplies : ${filled}/42\nStatut : ${meta.statut || 'brouillon'}\nDate soumission : ${meta.dateSoumission || '—'}`);
        };

        window.approuverInscription = function (id) {
            inst.pedagogie.nouvellesInscriptions = inst.pedagogie.nouvellesInscriptions.filter(i => i.id !== id);
            saveDb();
            renderPedagogie();
        };

        // Open Student Card Modal
        window.openStudentCardModal = function(eleveId) {
            const el = eleves.find(e => e.id == eleveId) || eleves[0] || { nom: 'MUKENDI KABUYA', prenom: 'David', classe: isRetro ? '3ème Humanité Sc.' : '6ème Primaire', matricule: 'HR-2026-0451' };
            const modal = document.getElementById('modal-generic-pedago');
            const content = document.getElementById('modal-generic-pedago-content');
            if (!modal || !content) return;

            content.innerHTML = `
                <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-white/20">
                            <img src="${schoolLogo}" class="w-full h-full object-contain rounded-full" alt="Logo">
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-white uppercase">Carte d'Élève Officielle EPST</h3>
                            <p class="text-xs text-amber-400 font-bold">${schoolName} • Année 2025-2026</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="printCardElement('student-card-preview')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Carte PVC
                        </button>
                        <button onclick="document.getElementById('modal-generic-pedago').classList.add('hidden')" class="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <!-- CARD PREVIEW (CR80 Credit Card Format) -->
                <div class="flex justify-center p-4">
                    <div id="student-card-preview" class="w-[420px] rounded-3xl p-6 bg-gradient-to-br from-[#0c1f3a] via-[#091526] to-[#040a14] border-2 border-amber-500/40 text-white shadow-2xl relative overflow-hidden font-sans">
                        <!-- Top Header -->
                        <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                            <div class="flex items-center gap-2.5">
                                <div class="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow border border-white/30 shrink-0">
                                    <img src="${schoolLogo}" alt="Logo" class="w-full h-full object-contain rounded-full">
                                </div>
                                <div>
                                    <h4 class="text-[12px] font-black tracking-wider uppercase text-white">${schoolName}</h4>
                                    <p class="text-[8px] text-amber-300 font-bold uppercase tracking-widest">RDC • MINISTÈRE DE L'EPST</p>
                                </div>
                            </div>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-gray-950 uppercase tracking-widest">2025-2026</span>
                        </div>

                        <!-- Card Body -->
                        <div class="flex gap-4 items-center mb-4">
                            <div class="w-24 h-28 rounded-2xl overflow-hidden bg-white/10 border-2 border-amber-500/50 shrink-0 shadow-inner flex items-center justify-center">
                                <img src="${el.photo || (isRetro ? 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&q=80' : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&q=80')}" class="w-full h-full object-cover" alt="Photo Élève">
                            </div>
                            <div class="flex-1 min-w-0 space-y-1">
                                <p class="text-[9px] text-gray-400 uppercase font-black tracking-widest">Nom & Postnom</p>
                                <p class="text-sm font-black text-white truncate uppercase">${el.nom || 'MUKENDI'} ${el.prenom || 'David'}</p>
                                <p class="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">Classe / Option</p>
                                <p class="text-xs font-bold text-amber-400 truncate">${el.classe || '3ème Humanité'}</p>
                                <p class="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">Matricule Scolaire</p>
                                <p class="text-xs font-mono font-black text-emerald-400 tracking-wider">${el.matricule || 'HR-2026-0451'}</p>
                            </div>
                        </div>

                        <!-- Card Footer -->
                        <div class="pt-3 border-t border-white/10 flex items-center justify-between">
                            <div class="space-y-0.5">
                                <div class="font-mono text-[9px] text-gray-400 tracking-widest">||| | |||| | ||||| ||| ||</div>
                                <p class="text-[7px] text-gray-500 uppercase">Document officiel certifié EPST</p>
                            </div>
                            <div class="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=HR-ELEVE-${el.matricule||'2026'}" class="w-full h-full" alt="QR">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        };

        // Open School Certificate Modal
        window.openSchoolCertModal = function(type, eleveId) {
            const el = eleves.find(e => e.id == eleveId) || eleves[0] || { nom: 'MUKENDI KABUYA', prenom: 'David', classe: isRetro ? '3ème Humanité Sc.' : '6ème Primaire', matricule: 'HR-2026-0451' };
            const modal = document.getElementById('modal-generic-pedago');
            const content = document.getElementById('modal-generic-pedago-content');
            if (!modal || !content) return;

            const isFreq = type === 'frequentation';
            const docTitle = isFreq ? 'CERTIFICAT DE FRÉQUENTATION SCOLAIRE' : 'ATTESTATION DE RÉUSSITE & FIN DE CYCLE';

            content.innerHTML = `
                <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                        <h3 class="text-xl font-black text-white uppercase">${docTitle}</h3>
                        <p class="text-xs text-amber-400 font-bold">Génération de document officiel certifié EPST</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="printCardElement('cert-preview')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Document
                        </button>
                        <button onclick="document.getElementById('modal-generic-pedago').classList.add('hidden')" class="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <div class="p-4 bg-white text-gray-950 rounded-2xl shadow-xl font-serif max-w-2xl mx-auto" id="cert-preview">
                    <!-- EPST Header -->
                    <div class="text-center border-b-2 border-gray-800 pb-4 mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-16 h-16 rounded-full overflow-hidden bg-white p-0.5 border border-gray-300">
                                <img src="${schoolLogo}" alt="Logo" class="w-full h-full object-contain">
                            </div>
                            <div class="text-center flex-1">
                                <h4 class="text-xs font-black tracking-widest uppercase">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h4>
                                <p class="text-[10px] uppercase font-bold text-gray-700">MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE (EPST)</p>
                                <p class="text-[10px] font-bold text-gray-600">PROVINCE ÉDUCATIONNELLE DE KINSHASA</p>
                                <h3 class="text-base font-black uppercase text-blue-900 tracking-wider mt-1">${schoolName}</h3>
                                <p class="text-[9px] italic text-gray-600">${schoolCycle} • Devise : Excellence, Discipline, Travail</p>
                            </div>
                            <div class="w-14 h-14 bg-white p-1 rounded border border-gray-300 flex items-center justify-center">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=EPST-DOC-CERT-${el.matricule||'2026'}" class="w-full h-full" alt="QR">
                            </div>
                        </div>
                    </div>

                    <!-- Doc Title -->
                    <div class="text-center mb-8">
                        <h2 class="text-lg font-black tracking-widest uppercase underline text-gray-900">${docTitle}</h2>
                        <p class="text-xs font-mono text-gray-600 mt-1">N° Réf : EPST/KIN/HR/${new Date().getFullYear()}/${el.matricule || '0451'}</p>
                    </div>

                    <!-- Body -->
                    <div class="text-sm leading-relaxed space-y-4 px-4 text-justify font-sans">
                        <p>
                            Le Chef d'Établissement du <strong>${schoolName}</strong> soussigné, certifie par la présente que l'élève :
                        </p>
                        <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5 font-mono text-xs">
                            <p><strong>Nom, Postnom & Prénom :</strong> <span class="uppercase font-black">${el.nom || 'MUKENDI'} ${el.prenom || 'David'}</span></p>
                            <p><strong>Matricule Scolaire :</strong> ${el.matricule || 'HR-2026-0451'}</p>
                            <p><strong>Classe / Section :</strong> ${el.classe || '3ème Humanité Scientifique'}</p>
                            <p><strong>Institution :</strong> ${schoolName}</p>
                            <p><strong>Année Scolaire :</strong> 2025-2026</p>
                        </div>
                        <p>
                            ${isFreq 
                                ? "Est régulièrement inscrit(e) et fréquente assidûment les cours au sein de notre établissement pour l'année scolaire en cours. Sa conduite et son application sont jugées exemplaires." 
                                : "A satisfait avec succès à toutes les épreuves certificatives et de fin de cycle organisées conformément aux directives officielles du Ministère de l'EPST."}
                        </p>
                        <p>
                            En foi de quoi, le présent document lui est délivré pour servir et valoir ce que de droit.
                        </p>
                    </div>

                    <!-- Signatures -->
                    <div class="mt-12 pt-6 border-t border-gray-300 flex justify-between items-end px-6 font-sans text-xs">
                        <div>
                            <p class="text-gray-600">Fait à Kinshasa, le ${new Date().toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'})}</p>
                            <p class="font-bold text-gray-800 mt-1">Le Secrétariat Général</p>
                        </div>
                        <div class="text-center">
                            <div class="w-20 h-20 border-2 border-dashed border-red-400/60 rounded-full flex items-center justify-center mx-auto text-[8px] font-black text-red-500 uppercase rotate-12 mb-2">
                                [ Sceau Officiel<br>${schoolName} ]
                            </div>
                            <p class="font-black text-gray-900 uppercase">La Direction Générale</p>
                        </div>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        };

        // Open Official EPST Report Card Modal
        window.openOfficialReportCardModal = function(eleveId) {
            const el = eleves.find(e => e.id == eleveId) || eleves[0] || { nom: 'MUKENDI KABUYA', prenom: 'David', classe: isRetro ? '3ème Humanité Sc.' : '6ème Primaire', matricule: 'HR-2026-0451' };
            const modal = document.getElementById('modal-generic-pedago');
            const content = document.getElementById('modal-generic-pedago-content');
            if (!modal || !content) return;

            const cours = isRetro 
                ? [
                    { nom: 'Mathématiques (Algèbre & Géométrie)', max1: 20, p1: 17, p2: 16, ex1: 36, maxSem1: 80, max2: 20, p3: 18, p4: 17, ex2: 38, maxSem2: 80, maxGen: 160 },
                    { nom: 'Sciences Physiques & Chimie', max1: 20, p1: 15, p2: 16, ex1: 32, maxSem1: 80, max2: 20, p3: 16, p4: 15, ex2: 34, maxSem2: 80, maxGen: 160 },
                    { nom: 'Français (Langue & Littérature)', max1: 20, p1: 16, p2: 15, ex1: 34, maxSem1: 80, max2: 20, p3: 17, p4: 16, ex2: 35, maxSem2: 80, maxGen: 160 },
                    { nom: 'Anglais', max1: 10, p1: 8, p2: 9, ex1: 18, maxSem1: 40, max2: 10, p3: 9, p4: 8, ex2: 17, maxSem2: 40, maxGen: 80 },
                    { nom: 'Informatique & Technologie', max1: 10, p1: 10, p2: 9, ex1: 19, maxSem1: 40, max2: 10, p3: 10, p4: 10, ex2: 20, maxSem2: 40, maxGen: 80 },
                    { nom: 'Histoire & Géographie', max1: 10, p1: 8, p2: 8, ex1: 16, maxSem1: 40, max2: 10, p3: 8, p4: 9, ex2: 17, maxSem2: 40, maxGen: 80 },
                    { nom: 'Éducation Civique & Morale', max1: 10, p1: 9, p2: 10, ex1: 19, maxSem1: 40, max2: 10, p3: 10, p4: 9, ex2: 19, maxSem2: 40, maxGen: 80 }
                ]
                : [
                    { nom: 'Français (Lecture, Grammaire, Orthographe)', max1: 30, p1: 26, p2: 27, ex1: 54, maxSem1: 120, max2: 30, p3: 28, p4: 27, ex2: 56, maxSem2: 120, maxGen: 240 },
                    { nom: 'Mathématiques (Calcul & Problèmes)', max1: 30, p1: 27, p2: 28, ex1: 56, maxSem1: 120, max2: 30, p3: 29, p4: 28, ex2: 58, maxSem2: 120, maxGen: 240 },
                    { nom: 'Sciences & Éveil Scientifique', max1: 20, p1: 18, p2: 17, ex1: 36, maxSem1: 80, max2: 20, p3: 18, p4: 19, ex2: 37, maxSem2: 80, maxGen: 160 },
                    { nom: 'Histoire & Géographie de la RDC', max1: 10, p1: 9, p2: 8, ex1: 18, maxSem1: 40, max2: 10, p3: 9, p4: 9, ex2: 18, maxSem2: 40, maxGen: 80 },
                    { nom: 'Éducation Civique & Dessin', max1: 10, p1: 9, p2: 10, ex1: 19, maxSem1: 40, max2: 10, p3: 10, p4: 10, ex2: 19, maxSem2: 40, maxGen: 80 }
                ];

            let totMax = 0;
            let totObt = 0;
            const rows = cours.map(c => {
                const totSem1 = c.p1 + c.p2 + c.ex1;
                const totSem2 = c.p3 + c.p4 + c.ex2;
                const totFinal = totSem1 + totSem2;
                totMax += c.maxGen;
                totObt += totFinal;
                return `
                    <tr class="text-xs hover:bg-gray-50 border-b border-gray-200">
                        <td class="py-2 px-3 font-bold text-gray-900">${c.nom}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold">${c.max1}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-blue-700">${c.p1}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-blue-700">${c.p2}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-indigo-800">${c.ex1}</td>
                        <td class="py-2 px-2 text-center font-mono font-black bg-blue-50 text-blue-900">${totSem1}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-emerald-700">${c.p3}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-emerald-700">${c.p4}</td>
                        <td class="py-2 px-2 text-center font-mono font-bold text-teal-800">${c.ex2}</td>
                        <td class="py-2 px-2 text-center font-mono font-black bg-emerald-50 text-emerald-900">${totSem2}</td>
                        <td class="py-2 px-3 text-center font-mono font-black bg-amber-50 text-amber-900">${totFinal} / ${c.maxGen}</td>
                    </tr>
                `;
            }).join('');

            const pctFinal = Math.round((totObt / totMax) * 100);

            content.innerHTML = `
                <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                        <h3 class="text-xl font-black text-white uppercase">Bulletin Scolaire Officiel EPST Numérisé</h3>
                        <p class="text-xs text-amber-400 font-bold">${schoolName} • Année Académique 2025-2026</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="printCardElement('bulletin-epst-preview')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Bulletin Officiel
                        </button>
                        <button onclick="document.getElementById('modal-generic-pedago').classList.add('hidden')" class="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <div class="p-6 bg-white text-gray-950 rounded-2xl shadow-2xl font-sans max-w-4xl mx-auto overflow-x-auto" id="bulletin-epst-preview">
                    <!-- Top Header -->
                    <div class="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-16 h-16 rounded-full overflow-hidden bg-white p-0.5 border border-gray-300 shadow">
                                <img src="${schoolLogo}" alt="Logo" class="w-full h-full object-contain">
                            </div>
                            <div>
                                <h4 class="text-[11px] font-black uppercase tracking-widest text-gray-800">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h4>
                                <p class="text-[9px] uppercase font-bold text-gray-600">MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE</p>
                                <h2 class="text-base font-black uppercase text-blue-900">${schoolName}</h2>
                                <p class="text-[9px] font-bold text-gray-500">${schoolCycle}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <h3 class="text-sm font-black uppercase text-gray-900 border-b pb-0.5">BULLETIN SCOLAIRE OFFICIEL</h3>
                            <p class="text-[10px] font-mono text-gray-600 mt-1">Année Scolaire : 2025-2026</p>
                            <p class="text-[10px] font-mono text-gray-600">N° Matricule : <strong>${el.matricule || 'HR-2026-0451'}</strong></p>
                        </div>
                    </div>

                    <!-- Eleve Info Header -->
                    <div class="grid grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-300 rounded-xl mb-4 text-xs font-mono">
                        <div><strong>Élève :</strong> <span class="uppercase font-bold">${el.nom || 'MUKENDI'} ${el.prenom || 'David'}</span></div>
                        <div><strong>Classe :</strong> ${el.classe || '3ème Humanité Sc.'}</div>
                        <div><strong>Conduite :</strong> <span class="text-emerald-700 font-bold">Très Bonne (TB)</span></div>
                    </div>

                    <!-- Grades Table -->
                    <table class="w-full border-collapse border border-gray-300 text-left mb-4">
                        <thead class="bg-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-700">
                            <tr>
                                <th class="py-2 px-3 border border-gray-300">Branches / Cours</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">Max</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">1ère P</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">2ème P</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">Exam 1</th>
                                <th class="py-2 px-2 border border-gray-300 text-center bg-blue-100 text-blue-900">Total Sem 1</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">3ème P</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">4ème P</th>
                                <th class="py-2 px-2 border border-gray-300 text-center">Exam 2</th>
                                <th class="py-2 px-2 border border-gray-300 text-center bg-emerald-100 text-emerald-900">Total Sem 2</th>
                                <th class="py-2 px-3 border border-gray-300 text-center bg-amber-100 text-amber-900">Total Général</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>

                    <!-- Totals & Jury Deliberation -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-300 rounded-xl mb-4 text-xs font-mono">
                        <div class="space-y-1">
                            <p><strong>Total Obtenu :</strong> <span class="font-bold text-blue-900">${totObt} / ${totMax}</span></p>
                            <p><strong>Pourcentage Général :</strong> <span class="text-sm font-black text-emerald-700">${pctFinal}%</span></p>
                            <p><strong>Rang :</strong> <span class="font-bold text-purple-900">1er / 45 élèves</span></p>
                        </div>
                        <div class="space-y-1">
                            <p><strong>Application :</strong> <span class="text-emerald-700 font-bold">Élite & Régulière</span></p>
                            <p><strong>Décision Délibération :</strong> <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded border border-emerald-300">ADMIS(E) EN CLASSE SUPÉRIEURE</span></p>
                        </div>
                        <div class="flex items-center justify-end gap-3">
                            <div class="text-right text-[9px] text-gray-500">
                                <p>Authenticité Cryptographique</p>
                                <p>QR Code Sécurisé EPST</p>
                            </div>
                            <div class="w-14 h-14 bg-white p-1 rounded border border-gray-300">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BULLETIN-EPST-VERIF-${el.matricule||'2026'}-${pctFinal}PCT" class="w-full h-full" alt="QR">
                            </div>
                        </div>
                    </div>

                    <!-- Signatures -->
                    <div class="pt-4 flex justify-between items-center text-xs font-sans border-t border-gray-200">
                        <div>
                            <p class="text-gray-500 text-[10px]">Le Titulaire de Classe</p>
                            <p class="font-bold text-gray-800 mt-6">Signature & Sceau</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500 text-[10px]">Le Chef d'Établissement</p>
                            <p class="font-bold text-gray-800 mt-6">La Direction Générale</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-500 text-[10px]">Le Tuteur / Parent</p>
                            <p class="font-bold text-gray-800 mt-6">Vu & Pris Connaissance</p>
                        </div>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        };

        window.printCardElement = function(elementId) {
            const el = document.getElementById(elementId);
            if (!el) return;
            const printWindow = window.open('', '', 'height=800,width=1000');
            printWindow.document.write('<html><head><title>Impression Document Officiel EPST</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; color: #000; background: #fff; }');
            printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }');
            printWindow.document.write('th, td { border: 1px solid #ccc; padding: 5px 6px; text-align: left; }');
            printWindow.document.write('th { background-color: #f3f4f6; text-transform: uppercase; font-size: 9px; }');
            printWindow.document.write('button { display: none !important; }');
            printWindow.document.write('</style></head><body>');
            printWindow.document.write(el.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };

        // Render Tabs Content
        let tabContent = '';

        if (currentPedagogyTab === 'previsions') {
            tabContent = `
                <!-- Prévisions soumises par les enseignants (live depuis localStorage) -->
                <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
                    <h3 class="font-black text-base uppercase tracking-wider mb-6 flex items-center gap-2">
                        <i data-lucide="map" class="w-5 h-5 text-amber-400"></i>
                        Prévisions de Matières (42 Semaines) — Suivi & Validation
                        ${soumis > 0 ? `<span class="ml-2 px-2 py-0.5 bg-amber-500 text-[#0a192f] text-xs font-black rounded-full">${soumis} à valider</span>` : ''}
                    </h3>

                    ${filteredMeta.length === 0 ? `
                    <div class="text-center py-12">
                        <i data-lucide="inbox" class="w-12 h-12 text-gray-600 mx-auto mb-4"></i>
                        <p class="text-gray-400 font-bold">Aucune prévision soumise</p>
                        <p class="text-xs text-gray-500 mt-2">Les prévisions apparaîtront ici dès qu'un enseignant les soumettra depuis son Espace.</p>
                    </div>
                    ` : `
                    <div class="space-y-4">
                        ${filteredMeta.map(meta => {
                            const data = getAllPrevisionData(meta.key);
                            const filled = Object.keys(data).filter(k => k.endsWith('_chapitres') && data[k]).length;
                            const pct = Math.round((filled / 42) * 100);
                            const statutColor = meta.statut === 'approuve' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
                                                meta.statut === 'rejete' ? 'text-rose-400 bg-rose-500/20 border-rose-500/30' :
                                                meta.statut === 'soumis' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' :
                                                'text-gray-400 bg-white/10 border-white/20';
                            const statutLabel = meta.statut === 'approuve' ? '✓ Approuvé' :
                                                meta.statut === 'rejete' ? '✗ Rejeté' :
                                                meta.statut === 'soumis' ? '⏳ En attente' : 'Brouillon';
                            return `
                            <div class="p-5 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/8 transition">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm">
                                            ${meta.key.split('.').map(p => p[0]||'').join('').toUpperCase().slice(0,2)}
                                        </div>
                                        <div>
                                            <p class="font-black text-sm">${meta.key}</p>
                                            <p class="text-xs text-gray-400 mt-0.5">
                                                ${meta.matiere ? `<span class="text-white font-bold">${meta.matiere}</span> — ` : ''}${meta.classe || '—'}
                                            </p>
                                            ${meta.dateSoumission ? `<p class="text-[10px] text-gray-500 mt-0.5">Soumis le : ${meta.dateSoumission}</p>` : ''}
                                            ${meta.commentaireDirection ? `<p class="text-[10px] text-rose-400 mt-0.5 italic">Motif : ${meta.commentaireDirection}</p>` : ''}
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-3 min-w-[200px]">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[10px] text-gray-400 uppercase font-bold">Programme</span>
                                            <span class="text-xs font-black text-white">${filled}/42 sem. (${pct}%)</span>
                                        </div>
                                        <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div class="h-full rounded-full transition-all duration-500" style="width:${pct}%; background: linear-gradient(90deg, #f59e0b, #10b981)"></div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-black border ${statutColor}">${statutLabel}</span>
                                            <div class="flex gap-2">
                                                <button onclick="voirPrevision('${meta.key}')" class="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition" title="Voir détails">
                                                    <i data-lucide="eye" class="w-4 h-4 text-gray-300"></i>
                                                </button>
                                                ${meta.statut === 'soumis' ? `
                                                <button onclick="approuverPrevision('${meta.key}')" class="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition" title="Approuver">
                                                    <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
                                                </button>
                                                <button onclick="rejeterPrevision('${meta.key}')" class="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg transition" title="Rejeter">
                                                    <i data-lucide="x" class="w-4 h-4 text-rose-400"></i>
                                                </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>`}
                </div>
            `;
        } else if (currentPedagogyTab === 'examens') {
            tabContent = `
                <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="font-black text-lg uppercase tracking-wider flex items-center gap-2 text-white">
                                <i data-lucide="award" class="w-5 h-5 text-amber-400"></i>
                                Registre Officiel des Candidats aux Épreuves Nationales (${examName})
                            </h3>
                            <p class="text-xs text-gray-400 mt-1">Suivi des finalistes de ${schoolName} • Centre de passation KIN-OUEST</p>
                        </div>
                        <button onclick="alert('Bordereau officiel des candidats généré pour l\'Inspection Provinciale.')" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Bordereau Candidats
                        </button>
                    </div>

                    <div class="overflow-x-auto rounded-2xl border border-white/10">
                        <table class="w-full text-left text-xs bg-white/5">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10">
                                <tr>
                                    <th class="py-3 px-4">Candidat (Nom & Postnom)</th>
                                    <th class="py-3 px-3">Code Candidat EPST</th>
                                    <th class="py-3 px-3">Classe & Option</th>
                                    <th class="py-3 px-3 text-center">Moyenne Simulation</th>
                                    <th class="py-3 px-3 text-center">Mention Prévisionnelle</th>
                                    <th class="py-3 px-4 text-right">Fiche Examen</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 font-sans">
                                ${finalistes.length === 0 ? `
                                    <tr><td colspan="6" class="py-8 text-center text-gray-400 italic">Aucun finaliste enregistré pour cette promotion.</td></tr>
                                ` : finalistes.map((el, i) => `
                                    <tr class="hover:bg-white/5 transition">
                                        <td class="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xs">
                                                ${(el.nom[0]||'')+(el.prenom[0]||'')}
                                            </div>
                                            <div>
                                                <p class="uppercase">${el.nom} ${el.prenom}</p>
                                                <p class="text-[10px] text-gray-400 font-mono font-normal">Matr: ${el.matricule || 'HR-0451'}</p>
                                            </div>
                                        </td>
                                        <td class="py-3.5 px-3 font-mono font-bold text-purple-300">EX-${2026}-KIN-${String(100+i).padStart(4,'0')}</td>
                                        <td class="py-3.5 px-3 font-semibold text-gray-200">${el.classe}</td>
                                        <td class="py-3.5 px-3 text-center font-mono font-black text-emerald-400">${72 + (i % 15)}%</td>
                                        <td class="py-3.5 px-3 text-center font-bold">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${i % 3 === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                                                ${i % 3 === 0 ? '★ Distinction' : '✓ Satisfaction'}
                                            </span>
                                        </td>
                                        <td class="py-3.5 px-4 text-right">
                                            <button onclick="openSchoolCertModal('frequentation', '${el.id}')" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">
                                                Fiche Candidat
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (currentPedagogyTab === 'documents') {
            tabContent = `
                <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
                    <h3 class="font-black text-lg uppercase tracking-wider mb-6 flex items-center gap-2 text-white">
                        <i data-lucide="file-check-2" class="w-5 h-5 text-amber-400"></i>
                        Guichet Numérique des Documents Scolaires & Cartes d'Élèves (Zéro Papier)
                    </h3>

                    <div class="overflow-x-auto rounded-2xl border border-white/10">
                        <table class="w-full text-left text-xs bg-white/5">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10">
                                <tr>
                                    <th class="py-3 px-4">Élève</th>
                                    <th class="py-3 px-3">Classe</th>
                                    <th class="py-3 px-3">Matricule</th>
                                    <th class="py-3 px-4 text-right">Génération de Documents</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 font-sans">
                                ${eleves.map(el => `
                                    <tr class="hover:bg-white/5 transition">
                                        <td class="py-3.5 px-4 font-bold text-white uppercase">${el.nom} ${el.prenom}</td>
                                        <td class="py-3.5 px-3 font-semibold text-gray-300">${el.classe}</td>
                                        <td class="py-3.5 px-3 font-mono text-emerald-400 font-bold">${el.matricule || 'HR-2026-0451'}</td>
                                        <td class="py-3.5 px-4 text-right space-x-1.5">
                                            <button onclick="openStudentCardModal('${el.id}')" class="px-3 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-xs font-bold transition inline-flex items-center gap-1">
                                                <i data-lucide="credit-card" class="w-3.5 h-3.5"></i> Carte Élève
                                            </button>
                                            <button onclick="openSchoolCertModal('frequentation', '${el.id}')" class="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-xs font-bold transition inline-flex items-center gap-1">
                                                <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Fréquentation
                                            </button>
                                            <button onclick="openSchoolCertModal('reussite', '${el.id}')" class="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-xs font-bold transition inline-flex items-center gap-1">
                                                <i data-lucide="award" class="w-3.5 h-3.5"></i> Attestation
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (currentPedagogyTab === 'bulletins') {
            tabContent = `
                <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="font-black text-lg uppercase tracking-wider flex items-center gap-2 text-white">
                                <i data-lucide="pie-chart" class="w-5 h-5 text-amber-400"></i>
                                Bulletins Officiels EPST avec QR Code d'Authentification
                            </h3>
                            <p class="text-xs text-gray-400 mt-1">Calcul automatique des moyennes semestrielles, rangs, cotes de conduite et décisions de passage.</p>
                        </div>
                    </div>

                    <div class="overflow-x-auto rounded-2xl border border-white/10">
                        <table class="w-full text-left text-xs bg-white/5">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10">
                                <tr>
                                    <th class="py-3 px-4">Élève</th>
                                    <th class="py-3 px-3">Classe</th>
                                    <th class="py-3 px-3 text-center">Moyenne Trimestre</th>
                                    <th class="py-3 px-3 text-center">Conduite</th>
                                    <th class="py-3 px-3 text-center">Décision</th>
                                    <th class="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 font-sans">
                                ${eleves.map((el, i) => `
                                    <tr class="hover:bg-white/5 transition">
                                        <td class="py-3.5 px-4 font-bold text-white uppercase">${el.nom} ${el.prenom}</td>
                                        <td class="py-3.5 px-3 font-semibold text-gray-300">${el.classe}</td>
                                        <td class="py-3.5 px-3 text-center font-mono font-black text-emerald-400">${75 + (i % 12)}%</td>
                                        <td class="py-3.5 px-3 text-center font-bold text-emerald-300">Très Bonne</td>
                                        <td class="py-3.5 px-3 text-center font-bold">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                Admis(e)
                                            </span>
                                        </td>
                                        <td class="py-3.5 px-4 text-right">
                                            <button onclick="openOfficialReportCardModal('${el.id}')" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-black text-xs rounded-xl shadow transition inline-flex items-center gap-1.5">
                                                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Voir Bulletin EPST
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (currentPedagogyTab === 'inscriptions') {
            tabContent = `
                <!-- Inscriptions en attente -->
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-black text-base uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="user-plus" class="w-5 h-5 text-blue-400"></i>
                            Demandes d'Inscription en Probation
                        </h3>
                        <span class="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-black rounded-full border border-rose-500/30">${inst.pedagogie.nouvellesInscriptions.length} En attente</span>
                    </div>
                    ${inst.pedagogie.nouvellesInscriptions.length === 0
                        ? '<p class="text-center text-sm text-gray-500 italic py-8">Aucune demande en probation.</p>'
                        : `<div class="space-y-3">
                            ${inst.pedagogie.nouvellesInscriptions.map(insc => `
                            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/8 transition border border-white/5">
                                <div>
                                    <p class="font-bold">${insc.nom}</p>
                                    <p class="text-xs text-gray-400 mt-1">${insc.classe} ${insc.option ? `— ${insc.option}` : ''}</p>
                                    <p class="text-[10px] text-gray-500 mt-0.5">Réf: ${insc.id} • ${insc.date}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="approuverInscription('${insc.id}')" class="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition" title="Approuver">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="approuverInscription('${insc.id}')" class="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/30 transition" title="Rejeter">
                                        <i data-lucide="x" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>`).join('')}
                        </div>`}
                </div>
            `;
        }

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500/40 shadow-xl shrink-0 flex items-center justify-center">
                        <img src="${schoolLogo}" alt="Logo" class="w-full h-full object-contain rounded-full">
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Pédagogie &amp; Inspection EPST</h2>
                            <span class="px-2.5 py-0.5 rounded-full ${isRetro ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} text-[10px] font-black uppercase">${db.ecoleActive}</span>
                        </div>
                        <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Suite Pédagogique d'Excellence • ${schoolCycle}</p>
                    </div>
                </div>
            </div>

            <!-- Navigation Sub-tabs Pédagogie -->
            <div class="flex flex-wrap gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button onclick="switchPedagogyTab('previsions')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${currentPedagogyTab === 'previsions' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                    <i data-lucide="map" class="w-4 h-4"></i> Prévisions 42 Semaines
                </button>
                <button onclick="switchPedagogyTab('examens')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${currentPedagogyTab === 'examens' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                    <i data-lucide="award" class="w-4 h-4"></i> Épreuves Nationales (${examName})
                </button>
                <button onclick="switchPedagogyTab('documents')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${currentPedagogyTab === 'documents' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                    <i data-lucide="file-check-2" class="w-4 h-4"></i> Guichet Documents &amp; Cartes
                </button>
                <button onclick="switchPedagogyTab('bulletins')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${currentPedagogyTab === 'bulletins' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                    <i data-lucide="pie-chart" class="w-4 h-4"></i> Bulletins EPST (QR Code)
                </button>
                <button onclick="switchPedagogyTab('inscriptions')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${currentPedagogyTab === 'inscriptions' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                    <i data-lucide="user-plus" class="w-4 h-4"></i> Inscriptions (${inst.pedagogie.nouvellesInscriptions.length})
                </button>
            </div>

            <!-- KPIs Prévisions -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3"><i data-lucide="users" class="w-5 h-5 text-blue-400"></i></div>
                    <div class="text-2xl font-black">${total}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Enseignants ${db.ecoleActive}</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3"><i data-lucide="clock" class="w-5 h-5 text-amber-400"></i></div>
                    <div class="text-2xl font-black text-amber-400">${soumis}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">En attente validation</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3"><i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i></div>
                    <div class="text-2xl font-black text-emerald-400">${approuves}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Approuvées</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3"><i data-lucide="award" class="w-5 h-5 text-purple-400"></i></div>
                    <div class="text-2xl font-black text-purple-400">${finalistes.length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Finalistes ${examName}</div>
                </div>
            </div>

            <!-- Tab Content -->
            ${tabContent}

            <!-- Generic Pedagogical Modal Container -->
            <div id="modal-generic-pedago" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
                <div class="bg-[#0c1f3a] border border-white/20 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" id="modal-generic-pedago-content">
                    <!-- Injected dynamically -->
                </div>
            </div>
        `;
    }

    // ==========================================
    // PALMARÈS — Liste élèves par classe/option/section
    // ==========================================
    function renderPalmares() {
        const inst = db.institutions[db.ecoleActive];
        const isRetro = db.ecoleActive === 'Retrouvailles';
        
        // ── Charger les vrais élèves depuis l'inscription ──
        const allEleves = JSON.parse(localStorage.getItem('hr_eleves_db')) || [];
        const eleves = allEleves.filter(e => e.ecole === db.ecoleActive && e.statut !== 'Rejeté');
        const classes = [...new Set(eleves.map(e => e.classe).filter(Boolean))];

        // Aggregate stats
        const byClasse = {};
        eleves.forEach(e => {
            const key = e.classe || 'Non classé';
            if (!byClasse[key]) byClasse[key] = [];
            byClasse[key].push(e);
        });

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Palmarès Officiel</h2>
                    <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Listes des élèves par classe & section</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="window.print()" class="px-5 py-2.5 bg-white/10 border border-white/15 text-white font-bold rounded-xl hover:bg-white/20 transition text-sm flex items-center gap-2">
                        <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i> Imprimer Registre
                    </button>
                </div>
            </div>

            <!-- KPIs -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3"><i data-lucide="users" class="w-5 h-5 text-blue-400"></i></div>
                    <div class="text-2xl font-black">${eleves.length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Effectif Total</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3"><i data-lucide="layers" class="w-5 h-5 text-amber-400"></i></div>
                    <div class="text-2xl font-black">${classes.length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Classes Actives</div>
                </div>
                ${isRetro ? `
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3"><i data-lucide="git-branch" class="w-5 h-5 text-purple-400"></i></div>
                    <div class="text-2xl font-black">${(inst.pedagogie.sections || []).length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Sections</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3"><i data-lucide="tag" class="w-5 h-5 text-emerald-400"></i></div>
                    <div class="text-2xl font-black">${(inst.pedagogie.optionsTech || []).length + (inst.pedagogie.optionsNonTech || []).length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Options</div>
                </div>` : `
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3"><i data-lucide="user-check" class="w-5 h-5 text-emerald-400"></i></div>
                    <div class="text-2xl font-black">${eleves.filter(e => e.paye > 0).length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Dossiers Actifs</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-3"><i data-lucide="alert-circle" class="w-5 h-5 text-rose-400"></i></div>
                    <div class="text-2xl font-black">${inst.pedagogie.nouvellesInscriptions.length}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">En Probation</div>
                </div>`}
            </div>

            <!-- Par Classe -->
            ${Object.entries(byClasse).map(([cls, elevesInClasse]) => `
            <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-6">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm">${cls}</span>
                        <span class="text-xs text-gray-400">${elevesInClasse.length} élève${elevesInClasse.length > 1 ? 's' : ''}</span>
                    </div>
                    <button onclick="window.print()" class="text-xs text-gray-400 hover:text-white transition"><i data-lucide="printer" class="w-4 h-4 inline"></i></button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase tracking-widest border-b border-white/10">
                            <tr>
                                <th class="pb-3">#</th>
                                <th class="pb-3">Nom & Prénom</th>
                                <th class="pb-3">Classe</th>
                                ${isRetro ? '<th class="pb-3">Section</th><th class="pb-3">Option</th>' : ''}
                                <th class="pb-3 text-right">Frais payés</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            ${elevesInClasse.map((e, i) => `
                            <tr class="hover:bg-white/3 transition">
                                <td class="py-3 text-xs text-gray-500 font-mono">${String(i+1).padStart(2,'0')}</td>
                                <td class="py-3 font-bold">${e.nom}</td>
                                <td class="py-3 text-sm text-gray-300">${e.classe}</td>
                                ${isRetro ? `<td class="py-3 text-sm">${e.section || '—'}</td><td class="py-3 text-sm">${e.option || '—'}</td>` : ''}
                                <td class="py-3 text-right">
                                    <span class="px-2 py-1 rounded-lg text-xs font-black ${e.paye > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">${e.paye > 0 ? e.paye + ' $' : 'En attente'}</span>
                                </td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`).join('')}

            ${Object.keys(byClasse).length === 0 ? `
            <div class="glass-panel p-16 rounded-2xl border border-white/10 text-center">
                <i data-lucide="users" class="w-12 h-12 text-gray-600 mx-auto mb-4"></i>
                <p class="text-gray-400 font-bold">Aucun élève enregistré pour ${db.ecoleActive}</p>
                <p class="text-xs text-gray-500 mt-2">Les élèves inscrits apparaîtront automatiquement ici.</p>
            </div>` : ''}
        `;
    }

    // ==========================================
    // RÉSULTATS — Cotations & Bulletins EPST
    // ==========================================
    function renderResultats() {
        const inst = db.institutions[db.ecoleActive];
        const enseignants = db.rh.comptes.filter(c => c.ecole === db.ecoleActive && c.role === 'Enseignant');
        const allCotations = getAllCotations();

        // Build a flat list of all grades across all teachers
        let allEleves = [];
        allCotations.forEach(entry => {
            const meta = getAllPrevisionsMeta().find(m => m.key === entry.enseignant);
            Object.entries(entry.notes).forEach(([nom, notes]) => {
                const i1 = notes.interro1 ?? 0, i2 = notes.interro2 ?? 0;
                const d1 = notes.devoir1 ?? 0, d2 = notes.devoir2 ?? 0;
                const ex1 = notes.exam1 ?? 0, ex2 = notes.exam2 ?? 0;
                const total = Math.round(((i1+i2)/20*20 + (d1+d2)/40*20 + ex1/30*30 + ex2/30*30) / 90 * 100);
                allEleves.push({ nom, i1, i2, d1, d2, ex1, ex2, total, enseignant: entry.enseignant, matiere: meta ? meta.matiere : '—' });
            });
        });

        const moyenne = allEleves.length ? Math.round(allEleves.reduce((s, e) => s + e.total, 0) / allEleves.length) : 0;
        const tauxReussite = allEleves.length ? Math.round(allEleves.filter(e => e.total >= 50).length / allEleves.length * 100) : 0;
        const enDifficulte = allEleves.filter(e => e.total < 50).length;
        const meilleursEleve = allEleves.length ? allEleves.reduce((best, e) => e.total > best.total ? e : best, allEleves[0]) : null;

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                        <i data-lucide="bar-chart-2" class="w-6 h-6 text-purple-400"></i>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Résultats & Cotations</h2>
                        <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Système EPST — MEN RDC</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <button onclick="window.print()" class="px-5 py-2.5 bg-white/10 border border-white/15 text-white font-bold rounded-xl hover:bg-white/20 transition text-sm flex items-center gap-2">
                        <i data-lucide="printer" class="w-4 h-4 text-purple-400"></i> Bulletins Officiels
                    </button>
                </div>
            </div>

            <!-- KPIs -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3"><i data-lucide="percent" class="w-5 h-5 text-purple-400"></i></div>
                    <div class="text-2xl font-black">${moyenne}%</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Moyenne Générale</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3"><i data-lucide="trending-up" class="w-5 h-5 text-emerald-400"></i></div>
                    <div class="text-2xl font-black">${tauxReussite}%</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Taux de Réussite</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-3"><i data-lucide="alert-triangle" class="w-5 h-5 text-rose-400"></i></div>
                    <div class="text-2xl font-black">${enDifficulte}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">En Difficulté</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3"><i data-lucide="award" class="w-5 h-5 text-amber-400"></i></div>
                    <div class="text-2xl font-black">${meilleursEleve ? meilleursEleve.total + '%' : '—'}</div>
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">${meilleursEleve ? meilleursEleve.nom.split(' ')[0] : 'Meilleur Élève'}</div>
                </div>
            </div>

            ${allEleves.length > 0 ? `
            <!-- Grille de cotation -->
            <div class="glass-panel p-4 rounded-2xl border border-white/10 mb-6">
                <h3 class="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Barème EPST</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><p class="text-[10px] font-black text-amber-400 uppercase">Interrogations</p><p class="text-base font-black">2 × /10 = /20</p></div>
                    <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"><p class="text-[10px] font-black text-blue-400 uppercase">Devoirs</p><p class="text-base font-black">2 × /20 = /40</p></div>
                    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><p class="text-[10px] font-black text-emerald-400 uppercase">Examen S1</p><p class="text-base font-black">/30</p></div>
                    <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"><p class="text-[10px] font-black text-purple-400 uppercase">Examen S2</p><p class="text-base font-black">/30</p></div>
                </div>
            </div>

            <!-- Tableau des résultats -->
            <div class="glass-panel p-6 rounded-2xl border border-white/10 overflow-x-auto">
                <h3 class="font-black text-base uppercase tracking-wider mb-6">Registre des Cotations — ${db.ecoleActive}</h3>
                <table class="w-full min-w-[900px] text-left">
                    <thead class="text-[10px] text-gray-400 uppercase tracking-widest border-b border-white/10">
                        <tr>
                            <th class="pb-4">Élève</th>
                            <th class="pb-4">Matière</th>
                            <th class="pb-4 text-center text-amber-400" colspan="2">Interro /10</th>
                            <th class="pb-4 text-center text-blue-400" colspan="2">Devoir /20</th>
                            <th class="pb-4 text-center text-emerald-400">Exam S1 /30</th>
                            <th class="pb-4 text-center text-purple-400">Exam S2 /30</th>
                            <th class="pb-4 text-center">Total %</th>
                            <th class="pb-4 text-center">Mention</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${allEleves.map(e => {
                            const m = mentionFromPct(e.total);
                            return `<tr class="hover:bg-white/3 transition">
                                <td class="py-3 font-bold">${e.nom}</td>
                                <td class="py-3 text-xs text-gray-400">${e.matiere}</td>
                                <td class="py-3 text-center text-amber-300 font-black">${e.i1}</td>
                                <td class="py-3 text-center text-amber-300 font-black">${e.i2}</td>
                                <td class="py-3 text-center text-blue-300 font-black">${e.d1}</td>
                                <td class="py-3 text-center text-blue-300 font-black">${e.d2}</td>
                                <td class="py-3 text-center text-emerald-300 font-black">${e.ex1}</td>
                                <td class="py-3 text-center text-purple-300 font-black">${e.ex2}</td>
                                <td class="py-3 text-center">
                                    <span class="text-lg font-black ${m.css}">${e.total}%</span>
                                </td>
                                <td class="py-3 text-center">
                                    <span class="px-2 py-1 rounded-full text-xs font-black ${e.total >= 60 ? 'bg-emerald-500/20 text-emerald-400' : e.total >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}">${m.icon} ${m.label}</span>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Alertes -->
            ${enDifficulte > 0 ? `
            <div class="mt-6 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5 text-rose-400"></i></div>
                    <div>
                        <p class="font-black text-sm text-rose-400 uppercase tracking-wide">Élèves en Difficulté — Intervention Requise</p>
                        <p class="text-xs text-gray-300 mt-0.5">${enDifficulte} élève${enDifficulte > 1 ? 's' : ''} avec un résultat inférieur à 50%</p>
                    </div>
                </div>
                <div class="space-y-2">
                    ${allEleves.filter(e => e.total < 50).map(e => `
                    <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div><p class="font-bold text-sm">${e.nom}</p><p class="text-xs text-gray-400">${e.matiere}</p></div>
                        <span class="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-black rounded-full">${e.total}% — ${mentionFromPct(e.total).label}</span>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            ` : `
            <!-- Pas de cotations -->
            <div class="glass-panel p-16 rounded-2xl border border-white/10 text-center">
                <i data-lucide="bar-chart-2" class="w-12 h-12 text-gray-600 mx-auto mb-4"></i>
                <p class="text-gray-300 font-black text-lg">Aucune cotation enregistrée</p>
                <p class="text-xs text-gray-500 mt-2">Les notes saisies par les enseignants dans leur Espace apparaîtront automatiquement ici.</p>
                <div class="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-md mx-auto">
                    <p class="text-xs text-amber-400 font-bold">💡 Comment ça marche ?</p>
                    <p class="text-xs text-gray-300 mt-1">Chaque enseignant se connecte à son Espace Enseignant → Cotation des Élèves, saisit les notes, et elles remontent ici en temps réel.</p>
                </div>
            </div>`}
        `;
    }

    function renderRH() {
        const allComptes = db.rh.comptes.filter(c => c.ecole === db.ecoleActive);
        const allPointages = db.rh.pointages.filter(p => p.ecole === db.ecoleActive);
        const inst = db.institutions[db.ecoleActive];
        const allClasses = inst.pedagogie.classes;

        const roleColors = {
            'Direction': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            'Enseignant': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'Préfet': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'Comptable': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'DP': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
            'Sur école': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
            'D.E': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
            'D.D': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400'
        };
        const dashboardLinks = {
            'Direction': '/admin-dashboard.html',
            'Enseignant': '/teacher-dashboard.html',
            'Préfet': '/prefet-dashboard.html',
            'Comptable': '/compta-dashboard.html',
            'DP': '/prefet-dashboard.html',
            'Sur école': '/prefet-dashboard.html',
            'D.E': '/prefet-dashboard.html',
            'D.D': '/prefet-dashboard.html'
        };
        const statutPColors = { 'Présent': 'bg-green-100 text-green-700', 'Retard': 'bg-amber-100 text-amber-700', 'Absent': 'bg-red-100 text-red-700' };

        // Données Charge Horaire Enseignants (Harmonie vs Retrouvailles)
        const allUsersDb = JSON.parse(localStorage.getItem('hr_users_db_v2')) || [];
        const affectationsDb = JSON.parse(localStorage.getItem('hr_affectations_db')) || [];
        const titularitesDb = JSON.parse(localStorage.getItem('hr_titularites_primaire_db')) || [];

        // Fusion des enseignants de l'école active
        const teacherComptes = allComptes.filter(c => ['Enseignant', 'Professeur', 'Sur école', 'Sur École', 'Instituteur', 'Institutrice'].includes(c.role));
        const teacherUsers = allUsersDb.filter(u => u.ecole === db.ecoleActive && ['Enseignant', 'Professeur', 'Sur école', 'Sur École', 'Instituteur', 'Institutrice'].includes(u.role));
        
        // Map unique par email ou nom
        const teachersMap = new Map();
        [...teacherComptes, ...teacherUsers].forEach(t => {
            const key = (t.email || `${t.prenom}_${t.nom}`).toLowerCase();
            if (!teachersMap.has(key)) {
                teachersMap.set(key, t);
            }
        });
        const allTeachers = Array.from(teachersMap.values());

        let globalHours = 0;
        let conformesCount = 0;
        let enAttenteCount = 0;

        const teacherRows = allTeachers.length > 0 ? allTeachers.map(t => {
            let totalHeures = 0;
            let classesSummary = '';
            let isConforme = false;
            let statutBadge = '';
            const teacherKey = encodeURIComponent(t.email || `${t.prenom}_${t.nom}`);

            if (db.ecoleActive === 'Retrouvailles') {
                const profAffs = affectationsDb.filter(a => a.teacherEmail === t.email || (t.nom && a.teacherName && a.teacherName.includes(t.nom)));
                totalHeures = profAffs.reduce((sum, a) => sum + (parseInt(a.weeklyHours) || 0), 0);
                globalHours += totalHeures;

                if (profAffs.length > 0) {
                    const uniqueClasses = Array.from(new Set(profAffs.map(a => a.classe)));
                    classesSummary = `<span class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-xs">${uniqueClasses.length} classe${uniqueClasses.length > 1 ? 's' : ''} affectée${uniqueClasses.length > 1 ? 's' : ''}</span>`;
                } else if (t.classes && t.classes.length > 0) {
                    totalHeures = t.classes.length * 4;
                    globalHours += totalHeures;
                    classesSummary = `<span class="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-xs">${t.classes.length} classe${t.classes.length > 1 ? 's' : ''}</span>`;
                } else {
                    classesSummary = '<span class="text-gray-500 italic text-xs">Aucune classe</span>';
                }

                isConforme = totalHeures >= 18 && totalHeures <= 24;
                if (isConforme) conformesCount++;
                else if (totalHeures === 0) enAttenteCount++;

                statutBadge = isConforme 
                    ? '<span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Conforme (18h-24h)</span>'
                    : totalHeures > 24
                    ? '<span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">Surcharge (>24h)</span>'
                    : totalHeures > 0
                    ? '<span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase">Temps Partiel (<18h)</span>'
                    : '<span class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase">Non Affecté</span>';

            } else {
                // Harmonie (Primaire & Maternelle)
                const tit = titularitesDb.find(a => a.teacherEmail === t.email || (t.nom && a.teacherName && a.teacherName.includes(t.nom)));
                const classeTit = tit ? tit.classe : (t.classeTitulaire || (t.classes && t.classes[0]) || null);
                const schedule = tit ? tit.schedule : (t.schedule || 'Lundi au Vendredi (07h30 - 12h30)');
                totalHeures = tit ? tit.weeklyHours : (schedule.includes('20h') ? 20 : (classeTit ? 28 : 0));
                globalHours += totalHeures;

                if (classeTit) {
                    classesSummary = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs">Titulaire ${classeTit}</span>`;
                    isConforme = totalHeures === 28 || totalHeures === 20;
                    conformesCount++;
                    statutBadge = '<span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Conforme EPST (28h)</span>';
                } else {
                    classesSummary = '<span class="text-gray-500 italic text-xs">En attente Sur École</span>';
                    enAttenteCount++;
                    statutBadge = '<span class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase">Non Affecté</span>';
                }
            }

            const coursesDeclared = Array.isArray(t.courses) ? t.courses.join(', ') : (t.courses || t.option || (db.ecoleActive === 'Harmonie' ? 'Enseignement Primaire' : 'Discipline Secondaire'));

            return `
                <tr class="hover:bg-white/5 transition-colors cursor-pointer group" onclick="openTeacherWorkloadModal('${teacherKey}')">
                    <td class="py-4 px-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl ${db.ecoleActive === 'Harmonie' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'} flex items-center justify-center font-black text-xs">
                                ${(t.prenom[0]||'')+(t.nom[0]||'')}
                            </div>
                            <div>
                                <p class="font-bold text-white text-sm group-hover:text-brand-400 transition">${t.prenom} ${t.nom}</p>
                                <p class="text-xs text-gray-400">${t.email || t.login || 'enseignant@ecole.cd'}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-3 text-xs text-gray-300 font-medium truncate max-w-[180px]" title="${coursesDeclared}">
                        ${coursesDeclared}
                    </td>
                    <td class="py-4 px-3">
                        ${classesSummary}
                    </td>
                    <td class="py-4 px-3 text-center font-mono font-black text-base ${totalHeures > 0 ? (db.ecoleActive === 'Harmonie' ? 'text-emerald-400' : (isConforme ? 'text-emerald-400' : 'text-purple-300')) : 'text-gray-500'}">
                        ${totalHeures > 0 ? `${totalHeures}h / sem` : '0h'}
                    </td>
                    <td class="py-4 px-3 text-center">
                        ${statutBadge}
                    </td>
                    <td class="py-4 px-3 text-right">
                        <button onclick="event.stopPropagation(); openTeacherWorkloadModal('${teacherKey}')" class="px-3.5 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 rounded-xl text-xs font-black transition inline-flex items-center gap-1.5">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i> Voir Charge
                        </button>
                    </td>
                </tr>
            `;
        }).join('') : `
            <tr>
                <td colspan="6" class="py-12 text-center text-gray-400 italic">
                    Aucun enseignant enregistré pour ${db.ecoleActive}.
                </td>
            </tr>
        `;

        ui.content.innerHTML = `
            <div class="mb-8 flex items-end justify-between">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">RH & Gestion du Personnel</h2>
                    <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Contrôle total par l'Administration</p>
                </div>
                <button id="btn-add-compte" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                    <i data-lucide="user-plus" class="w-5 h-5"></i> Créer un Compte
                </button>
            </div>

            <!-- RH Tabs -->
            <div class="flex flex-wrap bg-white/10 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-8 w-fit shadow-inner gap-1">
                <button id="rh-tab-comptes" onclick="rhTab('comptes')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-700 shadow-md text-brand-600">👤 Comptes & Accès</button>
                <button id="rh-tab-hierarchie" onclick="rhTab('hierarchie')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700">🏢 Organigramme</button>
                <button id="rh-tab-pointages" onclick="rhTab('pointages')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700">🕐 Pointages du Jour</button>
                <button id="rh-tab-classes" onclick="rhTab('classes')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700">📚 Attribution des Classes</button>
                <button id="rh-tab-charge" onclick="rhTab('charge')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700">⏱️ Charge Horaire des Enseignants</button>
            </div>

            <!-- TAB: COMPTES & ACCES -->
            <div id="rh-panel-comptes">
                <!-- Stats rapides -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    ${['Direction','Enseignant','Préfet','Comptable'].map(role => {
                        const count = allComptes.filter(c => c.role === role).length;
                        const icons = { Direction:'crown', Enseignant:'graduation-cap', Préfet:'shield', Comptable:'calculator' };
                        return `<div class="glass-panel p-5 rounded-2xl border border-white/10 hover:translate-y-[-2px] transition-all">
                            <div class="flex items-center gap-3 mb-2">
                                <i data-lucide="${icons[role]}" class="w-5 h-5 ${role==='Direction'?'text-amber-500':role==='Enseignant'?'text-blue-500':role==='Préfet'?'text-purple-500':'text-green-500'}"></i>
                                <span class="text-xs font-black text-gray-400 uppercase tracking-widest">${role}</span>
                            </div>
                            <div class="text-3xl font-black dark:text-white">${count}</div>
                        </div>`;
                    }).join('')}
                </div>

                <!-- Table des comptes -->
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20 overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b dark:border-gray-700">
                            <tr>
                                <th class="pb-5">Membre du Personnel</th>
                                <th class="pb-5">Rôle</th>
                                <th class="pb-5">Login</th>
                                <th class="pb-5">Statut</th>
                                <th class="pb-5 text-center">Tableau de Bord</th>
                                <th class="pb-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${allComptes.map(c => `
                                <tr class="hover:bg-[#112240]/50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td class="py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl ${roleColors[c.role]||'bg-white/10 text-gray-600'} flex items-center justify-center font-black text-sm">${(c.prenom[0]||'')+(c.nom[0]||'')}</div>
                                            <div>
                                                <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                                <p class="text-xs text-gray-400">${c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-5">
                                        <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${roleColors[c.role]||'bg-white/10 text-gray-600'}">${c.role}</span>
                                    </td>
                                    <td class="py-5 font-mono text-sm text-gray-600 dark:text-gray-300">${c.login}</td>
                                    <td class="py-5">
                                        <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${c.statut==='Actif'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}">
                                            ${c.statut==='Actif'?'● Actif':'○ Inactif'}
                                        </span>
                                    </td>
                                    <td class="py-5 text-center">
                                        <button onclick="window.open('${dashboardLinks[c.role]||'/admin-dashboard.html'}','_blank')" class="px-4 py-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 border border-brand-200 dark:border-brand-700 rounded-xl text-xs font-black hover:bg-brand-100 transition-all flex items-center gap-1.5 mx-auto">
                                            <i data-lucide="external-link" class="w-3 h-3"></i> Ouvrir
                                        </button>
                                    </td>
                                    <td class="py-5">
                                        <div class="flex gap-2 justify-center">
                                            <button title="Modifier" onclick="alert('Modification du compte ${c.prenom} ${c.nom}')" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                                                <i data-lucide="edit" class="w-4 h-4"></i>
                                            </button>
                                            <button title="Réinitialiser mdp" onclick="alert('Mot de passe réinitialisé pour ${c.prenom} ${c.nom}')" class="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all">
                                                <i data-lucide="key" class="w-4 h-4"></i>
                                            </button>
                                            <button title="${c.statut==='Actif'?'Désactiver':'Activer'}" onclick="toggleStatut(${c.id})" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                                <i data-lucide="${c.statut==='Actif'?'user-x':'user-check'}" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB: POINTAGES -->
            <div id="rh-panel-pointages" class="hidden">
                <div class="grid grid-cols-3 gap-4 mb-8">
                    ${['Présent','Retard','Absent'].map(s => {
                        const count = allPointages.filter(p => p.statut === s).length;
                        const colors = { Présent:'green', Retard:'amber', Absent:'red' };
                        return `<div class="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                            <div class="text-3xl font-black text-${colors[s]}-500 mb-1">${count}</div>
                            <div class="text-xs font-black text-gray-400 uppercase tracking-widest">${s}</div>
                        </div>`;
                    }).join('')}
                </div>
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20 overflow-x-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-black text-lg uppercase tracking-wider">Registre du ${new Date().toLocaleDateString('fr-FR')}</h3>
                        <div class="flex gap-3">
                            <button onclick="printRHReport()" class="px-5 py-2.5 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-gray-600">
                                <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Rapport
                            </button>
                            <button class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                                <i data-lucide="qr-code" class="w-4 h-4"></i> Scanner Empreinte / QR
                            </button>
                        </div>
                    </div>
                    <table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b dark:border-gray-700">
                            <tr><th class="pb-5">Employé</th><th class="pb-5">Rôle</th><th class="pb-5">Arrivée</th><th class="pb-5">Statut</th><th class="pb-5 text-right">Action</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${allPointages.map(p => `
                                <tr class="hover:bg-[#112240]/50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td class="py-4 font-bold dark:text-white">${p.nom}</td>
                                    <td class="py-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${roleColors[p.role]||'bg-white/10 text-gray-600'}">${p.role||'—'}</span></td>
                                    <td class="py-4 font-mono text-sm">${p.arrivee}</td>
                                    <td class="py-4"><span class="px-3 py-1.5 rounded-full text-xs font-black uppercase ${statutPColors[p.statut]||''}">${p.statut}</span></td>
                                    <td class="py-4 text-right">
                                        <button onclick="alert('Modification du pointage de ${p.nom}')" class="text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[#112240]/50 dark:hover:bg-gray-800 transition font-bold">Corriger</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB: ATTRIBUTION CLASSES -->
            <div id="rh-panel-classes" class="hidden">
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                    <h3 class="font-black text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
                        <i data-lucide="book-open" class="w-6 h-6 text-brand-500"></i>
                        Attribution des Classes aux Enseignants
                    </h3>
                    <p class="text-sm text-gray-500 mb-8">L'administrateur définit quels cours chaque enseignant dispense. Ces informations apparaissent dans leur tableau de bord.</p>
                    <div class="space-y-4">
                        ${allComptes.filter(c => c.role === 'Enseignant').map(c => `
                            <div class="p-5 bg-[#112240]/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">${(c.prenom[0]||'')+(c.nom[0]||'')}</div>
                                        <div>
                                            <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                            <p class="text-xs text-gray-400">${c.email}</p>
                                        </div>
                                    </div>
                                    <button onclick="alert('Classes sauvegardées pour ${c.prenom} ${c.nom}')" class="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-500 transition flex items-center gap-1.5">
                                        <i data-lucide="save" class="w-3.5 h-3.5"></i> Sauvegarder
                                    </button>
                                </div>
                                <div class="flex flex-wrap gap-2 mb-3">
                                    ${(c.classes||[]).map(cls => `
                                        <span class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                                            ${cls} <button onclick="alert('Retirer ${cls} de ${c.prenom} ${c.nom}')" class="text-blue-400 hover:text-red-500">×</button>
                                        </span>
                                    `).join('')}
                                    ${(c.classes||[]).length === 0 ? '<span class="text-xs text-gray-400 italic">Aucune classe attribuée</span>' : ''}
                                </div>
                                <select onchange="alert('Classe \"' + this.value + '\" ajoutée à ${c.prenom} ${c.nom}'); this.value='';" class="w-full px-4 py-2.5 bg-[#112240]/80 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                                    <option value="">+ Ajouter une classe / cours...</option>
                                    ${allClasses.map(cl => `<option value="${cl}">${cl}</option>`).join('')}
                                </select>
                            </div>
                        `).join('')}
                        ${allComptes.filter(c => c.role === 'Enseignant').length === 0 ? '<p class="text-center text-gray-400 italic py-10">Aucun enseignant enregistré pour cette institution.</p>' : ''}
                    </div>
                </div>
            </div>

            <!-- TAB: CHARGE HORAIRE DES ENSEIGNANTS -->
            <div id="rh-panel-charge" class="hidden">
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${db.ecoleActive === 'Harmonie' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}">
                                    Institution : ${db.ecoleActive === 'Harmonie' ? 'C.S. Harmonie (Maternelle & Primaire)' : 'G.S. Retrouvailles (Secondaire & Humanités)'}
                                </span>
                                <span class="text-xs text-gray-400">• Surveillance EPST</span>
                            </div>
                            <h3 class="font-black text-xl uppercase tracking-wider text-white flex items-center gap-2">
                                <i data-lucide="clock" class="w-6 h-6 text-brand-500"></i>
                                Surveillance de la Charge Horaire par Enseignant
                            </h3>
                            <p class="text-xs text-gray-400 mt-1">
                                ${db.ecoleActive === 'Harmonie' 
                                    ? 'Surveillance du régime officiel (28h/semaine) et des classes titulaires attribuées par Sur École.' 
                                    : 'Surveillance des volumes horaires (18h-24h/semaine) et des cours/classes affectés par le Directeur des Études (D.E).'}
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="printChargeReport()" class="px-5 py-2.5 bg-[#112240]/80 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 border border-white/20 text-xs">
                                <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Tableau Officiel
                            </button>
                        </div>
                    </div>

                    <!-- Stats rapides Charge Horaire -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Corps Enseignant</p>
                            <p class="text-3xl font-black text-white">${allTeachers.length}</p>
                            <p class="text-[10px] text-gray-400 mt-1">Enseignants ${db.ecoleActive}</p>
                        </div>
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <p class="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Conformité EPST</p>
                            <p class="text-3xl font-black text-emerald-400">${conformesCount}</p>
                            <p class="text-[10px] text-gray-400 mt-1">${db.ecoleActive === 'Harmonie' ? '28h / sem. Titulaire' : '18h à 24h / sem.'}</p>
                        </div>
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <p class="text-xs font-black text-brand-400 uppercase tracking-widest mb-1">Volume Global</p>
                            <p class="text-3xl font-black text-brand-400 font-mono">${globalHours}h</p>
                            <p class="text-[10px] text-gray-400 mt-1">Heures dispensées / sem.</p>
                        </div>
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <p class="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">En Attente</p>
                            <p class="text-3xl font-black text-amber-400">${enAttenteCount}</p>
                            <p class="text-[10px] text-gray-400 mt-1">Non encore affectés</p>
                        </div>
                    </div>

                    <!-- Tableau de Charge Horaire Détaillé par Enseignant & par Classe -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs" id="table-charge-horaire">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10 pb-4">
                                <tr>
                                    <th class="pb-4 px-3">Enseignant</th>
                                    <th class="pb-4 px-3">Discipline / Spécialité</th>
                                    <th class="pb-4 px-3">Affectations</th>
                                    <th class="pb-4 px-3 text-center">Volume Hebdo</th>
                                    <th class="pb-4 px-3 text-center">Statut EPST</th>
                                    <th class="pb-4 px-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                ${teacherRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- TAB: HIERARCHIE -->
            <div id="rh-panel-hierarchie" class="hidden">
                <div class="glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/20 min-h-[500px]">
                    <div class="mb-8 text-center">
                        <h3 class="font-black text-2xl uppercase tracking-widest text-brand-600 dark:text-brand-400">Organigramme Institutionnel</h3>
                        <p class="text-xs text-gray-500 font-bold uppercase mt-2">${db.ecoleActive}</p>
                    </div>
                    
                    <div class="flex flex-col items-center gap-8 relative pb-10">
                        ${db.ecoleActive === 'Harmonie' ? `
                            <!-- HARMONIE HIERARCHY -->
                            <div class="flex flex-col items-center relative">
                                <!-- Direction -->
                                ${allComptes.filter(c => c.role === 'Direction').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border-2 border-amber-500 z-10 w-64 text-center shadow-lg bg-amber-50 dark:bg-amber-900/20">
                                        <div class="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-2 shadow-inner">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-amber-600 uppercase mt-1">Direction Générale</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                <!-- DP -->
                                ${allComptes.filter(c => c.role === 'DP').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 z-10 w-64 text-center shadow-md bg-[#112240]/80 dark:bg-gray-800">
                                        <div class="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm mb-2">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-indigo-500 uppercase mt-1">Directeur Primaire</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                <!-- Sur Ecole -->
                                ${allComptes.filter(c => c.role === 'Sur école').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-cyan-200 dark:border-cyan-800 z-10 w-64 text-center shadow-sm bg-[#112240]/80 dark:bg-gray-800">
                                        <div class="w-10 h-10 mx-auto rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-sm mb-2">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-cyan-500 uppercase mt-1">Sur École</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                <!-- Enseignants -->
                                <div class="flex gap-4 flex-wrap justify-center mt-2 border-t-2 border-gray-300 dark:border-gray-600 pt-8 relative">
                                    <div class="absolute -top-1 left-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-600 -translate-x-1/2 -mt-7"></div>
                                    ${allComptes.filter(c => c.role === 'Enseignant').map(c => `
                                        <div class="glass-panel px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 w-48 text-center bg-[#112240]/50 dark:bg-gray-800/50">
                                            <p class="font-bold text-sm dark:text-white truncate">${c.prenom} ${c.nom}</p>
                                            <p class="text-[10px] font-black text-gray-500 uppercase mt-1">Enseignant</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : `
                            <!-- RETROUVAILLES HIERARCHY -->
                            <div class="flex flex-col items-center relative w-full">
                                <!-- Direction -->
                                ${allComptes.filter(c => c.role === 'Direction').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border-2 border-amber-500 z-10 w-64 text-center shadow-lg bg-amber-50 dark:bg-amber-900/20">
                                        <div class="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-2 shadow-inner">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-amber-600 uppercase mt-1">Direction Générale</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                <!-- Prefet -->
                                ${allComptes.filter(c => c.role === 'Préfet').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-purple-300 dark:border-purple-700 z-10 w-64 text-center shadow-md bg-[#112240]/80 dark:bg-gray-800">
                                        <div class="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm mb-2">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-purple-500 uppercase mt-1">Préfet</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                
                                <div class="flex w-full max-w-3xl justify-around relative pt-4">
                                    <div class="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                    <div class="absolute top-0 left-1/4 w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
                                    <div class="absolute top-0 right-1/4 w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
                                    
                                    <!-- D.E -->
                                    <div class="flex flex-col items-center">
                                        ${allComptes.filter(c => c.role === 'D.E').map(c => `
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-800 z-10 w-48 text-center shadow-sm bg-[#112240]/80 dark:bg-gray-800">
                                                <p class="font-bold dark:text-white text-sm">${c.prenom} ${c.nom}</p>
                                                <p class="text-[10px] font-black text-rose-500 uppercase mt-1">Dir. des Études</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <!-- D.D -->
                                    <div class="flex flex-col items-center">
                                        ${allComptes.filter(c => c.role === 'D.D').map(c => `
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 z-10 w-48 text-center shadow-sm bg-[#112240]/80 dark:bg-gray-800">
                                                <p class="font-bold dark:text-white text-sm">${c.prenom} ${c.nom}</p>
                                                <p class="text-[10px] font-black text-fuchsia-500 uppercase mt-1">Dir. de Discipline</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="w-full mt-10">
                                    <p class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Corps Professoral</p>
                                    <div class="flex gap-4 flex-wrap justify-center">
                                        ${allComptes.filter(c => c.role === 'Enseignant').map(c => `
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 w-48 text-center bg-[#112240]/50 dark:bg-gray-800/50">
                                                <p class="font-bold text-sm dark:text-white truncate">${c.prenom} ${c.nom}</p>
                                                <p class="text-[10px] font-black text-gray-500 uppercase mt-1">Enseignant</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <!-- MODAL CREATION COMPTE -->
            <div id="modal-create-compte" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="glass-panel bg-[#112240]/80 dark:bg-gray-900 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl border border-white/20">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="text-xl font-black dark:text-white uppercase tracking-tighter">Créer un Compte Personnel</h3>
                        <button onclick="document.getElementById('modal-create-compte').classList.add('hidden')" class="p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-xl transition">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <form class="space-y-4" onsubmit="createCompte(event)">
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="premium-label">Prénom *</label><input id="new-prenom" type="text" class="premium-input" placeholder="Ex: Paul" required></div>
                            <div><label class="premium-label">Nom *</label><input id="new-nom" type="text" class="premium-input" placeholder="Ex: BAYA" required></div>
                        </div>
                        <div><label class="premium-label">Email *</label><input id="new-email" type="email" class="premium-input" placeholder="prenom.nom@ecole.cd" required></div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="premium-label">Institution *</label>
                                <select id="new-ecole" class="premium-select" onchange="updateRoleOptions()">
                                    <option value="Harmonie" ${db.ecoleActive === 'Harmonie' ? 'selected' : ''}>C.S. Harmonie</option>
                                    <option value="Retrouvailles" ${db.ecoleActive === 'Retrouvailles' ? 'selected' : ''}>G.S. Retrouvailles</option>
                                </select>
                            </div>
                            <div>
                                <label class="premium-label">Rôle / Fonction *</label>
                                <select id="new-role" class="premium-select">
                                    <!-- Rempli dynamiquement -->
                                </select>
                            </div>
                        </div>
                        
                        <div><label class="premium-label">Mot de passe temporaire *</label><input id="new-pwd" type="password" class="premium-input" placeholder="••••••••" required></div>
                        <div class="pt-4 flex gap-3">
                            <button type="button" onclick="document.getElementById('modal-create-compte').classList.add('hidden')" class="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-[#112240]/50 dark:hover:bg-gray-800 transition">Annuler</button>
                            <button type="submit" class="flex-1 py-3 premium-btn rounded-xl font-black">Créer le Compte</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL DETAIL CHARGE HORAIRE ENSEIGNANT -->
            <div id="modal-teacher-workload" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
                <div class="glass-panel bg-[#0d1b2a] dark:bg-gray-900 rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
                    <div id="modal-teacher-workload-content">
                        <!-- Rempli dynamiquement par openTeacherWorkloadModal -->
                    </div>
                </div>
            </div>
        `;

        window.updateRoleOptions = function() {
            const ecole = document.getElementById('new-ecole').value;
            const roleSelect = document.getElementById('new-role');
            if(!roleSelect) return;
            
            let options = [];
            if (ecole === 'Harmonie') {
                options = ['Direction', 'DP', 'Sur école', 'Enseignant', 'Comptable'];
            } else {
                options = ['Direction', 'Préfet', 'D.E', 'D.D', 'Enseignant', 'Comptable'];
            }
            
            roleSelect.innerHTML = options.map(o => `<option value="${o}">${o}</option>`).join('');
        };
        
        // Init options on open
        setTimeout(updateRoleOptions, 100);

        // Tabs logic
        window.rhTab = function(tab) {
            ['comptes','pointages','classes','hierarchie','charge'].forEach(t => {
                const panel = document.getElementById('rh-panel-' + t);
                if (panel) panel.classList.toggle('hidden', t !== tab);
                const btn = document.getElementById('rh-tab-' + t);
                if (btn) {
                    btn.className = t === tab
                        ? 'px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-700 shadow-md text-brand-600'
                        : 'px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';
                }
            });
            if (window.lucide) lucide.createIcons();
        };

        window.toggleStatut = function(id) {
            const compte = db.rh.comptes.find(c => c.id === id);
            if (compte) {
                compte.statut = compte.statut === 'Actif' ? 'Inactif' : 'Actif';
                saveDb(); renderRH();
            }
        };

        window.printRHReport = function() {
            const printContent = document.querySelector('#rh-panel-pointages table').outerHTML;
            const today = new Date().toLocaleDateString('fr-FR');
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Rapport de Présence - ' + today + '</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
            printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
            printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
            printWindow.document.write('th { background-color: #f2f2f2; }');
            printWindow.document.write('h2 { text-align: center; }');
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<h2>Registre de Présence du ' + today + ' — ' + db.ecoleActive + '</h2>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };

        window.printChargeReport = function() {
            const printTable = document.getElementById('table-charge-horaire');
            if (!printTable) return;
            const today = new Date().toLocaleDateString('fr-FR');
            const printWindow = window.open('', '', 'height=700,width=900');
            printWindow.document.write('<html><head><title>Tableau Officiel de Charge Horaire - ' + db.ecoleActive + '</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; padding: 25px; color: #111; }');
            printWindow.document.write('h1 { font-size: 18px; text-transform: uppercase; margin-bottom: 4px; }');
            printWindow.document.write('p { font-size: 12px; color: #555; margin-top: 0; }');
            printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }');
            printWindow.document.write('th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }');
            printWindow.document.write('th { background-color: #f0f0f0; text-transform: uppercase; font-size: 10px; }');
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<h1>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO — EPST</h1>');
            printWindow.document.write('<h2>Tableau de Surveillance de la Charge Horaire — ' + (db.ecoleActive === 'Harmonie' ? 'C.S. HARMONIE (Primaire & Maternelle)' : 'G.S. RETROUVAILLES (Secondaire & Humanités)') + '</h2>');
            printWindow.document.write('<p>Édité le ' + today + ' par la Direction Générale Super-Admin</p>');
            printWindow.document.write(printTable.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };

        window.openTeacherWorkloadModal = function(teacherKey) {
            const key = decodeURIComponent(teacherKey);
            const teacher = allTeachers.find(t => (t.email === key) || (`${t.prenom}_${t.nom}` === key));
            if (!teacher) return;

            const modal = document.getElementById('modal-teacher-workload');
            const content = document.getElementById('modal-teacher-workload-content');
            if (!modal || !content) return;

            const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            let totalHeures = 0;
            let rowsHtml = '';
            let gridCells = '';

            if (db.ecoleActive === 'Retrouvailles') {
                const profAffs = affectationsDb.filter(a => a.teacherEmail === teacher.email || (teacher.nom && a.teacherName && a.teacherName.includes(teacher.nom)));
                totalHeures = profAffs.reduce((sum, a) => sum + (parseInt(a.weeklyHours) || 0), 0) || (teacher.classes ? teacher.classes.length * 4 : 0);

                if (profAffs.length > 0) {
                    rowsHtml = profAffs.map(a => {
                        const h = parseInt(a.weeklyHours) || 0;
                        const pct = totalHeures > 0 ? Math.round((h / totalHeures) * 100) : 0;
                        return `
                            <tr class="hover:bg-white/5">
                                <td class="py-3 px-3 font-bold text-white"><span class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">${a.classe}</span></td>
                                <td class="py-3 px-3 font-semibold text-white">${a.course}</td>
                                <td class="py-3 px-3 text-gray-400 font-mono">${a.day} (${a.timeSlot})</td>
                                <td class="py-3 px-3 text-center font-mono font-black text-emerald-400">${h}h / sem</td>
                                <td class="py-3 px-3 text-right">
                                    <div class="inline-flex items-center gap-2">
                                        <span class="font-bold text-gray-300 font-mono">${pct}%</span>
                                        <div class="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden inline-block"><div class="bg-purple-500 h-full rounded-full" style="width: ${pct}%"></div></div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('');
                } else if (teacher.classes && teacher.classes.length > 0) {
                    rowsHtml = teacher.classes.map(cl => `
                        <tr class="hover:bg-white/5">
                            <td class="py-3 px-3 font-bold text-white"><span class="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">${cl}</span></td>
                            <td class="py-3 px-3 font-semibold text-white">${teacher.courses || 'Matière assignée'}</td>
                            <td class="py-3 px-3 text-gray-400 font-mono">Horaires standards</td>
                            <td class="py-3 px-3 text-center font-mono font-black text-emerald-400">4h / sem</td>
                            <td class="py-3 px-3 text-right font-bold text-gray-300 font-mono">${Math.round(100/teacher.classes.length)}%</td>
                        </tr>
                    `).join('');
                } else {
                    rowsHtml = `<tr><td colspan="5" class="py-6 text-center text-gray-400 italic">Aucun cours ni classe actuellement affectés par la Direction des Études.</td></tr>`;
                }

                gridCells = `
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">07h30 - 09h10</td>
                        ${jours.map(j => {
                            const match = profAffs.find(a => a.day === j && a.timeSlot.includes('07h30'));
                            return match ? `<td class="py-2 px-1 text-center"><div class="bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${match.classe}<br><span class="text-[9px] font-normal text-gray-400">${match.course}</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>';
                        }).join('')}
                    </tr>
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">09h20 - 11h00</td>
                        ${jours.map(j => {
                            const match = profAffs.find(a => a.day === j && a.timeSlot.includes('09h20'));
                            return match ? `<td class="py-2 px-1 text-center"><div class="bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${match.classe}<br><span class="text-[9px] font-normal text-gray-400">${match.course}</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>';
                        }).join('')}
                    </tr>
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">11h30 - 13h10</td>
                        ${jours.map(j => {
                            const match = profAffs.find(a => a.day === j && a.timeSlot.includes('11h30'));
                            return match ? `<td class="py-2 px-1 text-center"><div class="bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${match.classe}<br><span class="text-[9px] font-normal text-gray-400">${match.course}</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>';
                        }).join('')}
                    </tr>
                `;
            } else {
                // Harmonie (Primaire)
                const tit = titularitesDb.find(a => a.teacherEmail === teacher.email || (teacher.nom && a.teacherName && a.teacherName.includes(teacher.nom)));
                const classeTit = tit ? tit.classe : (teacher.classeTitulaire || (teacher.classes && teacher.classes[0]) || null);
                const schedule = tit ? tit.schedule : (teacher.schedule || 'Lundi au Vendredi (07h30 - 12h30)');
                totalHeures = tit ? tit.weeklyHours : (schedule.includes('20h') ? 20 : (classeTit ? 28 : 0));

                if (classeTit) {
                    rowsHtml = `
                        <tr class="hover:bg-white/5">
                            <td class="py-3 px-3 font-bold text-white"><span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${classeTit}</span></td>
                            <td class="py-3 px-3 font-semibold text-white">Toutes disciplines (Titularité Primaire)</td>
                            <td class="py-3 px-3 text-gray-400 font-mono">${schedule}</td>
                            <td class="py-3 px-3 text-center font-mono font-black text-emerald-400">${totalHeures}h / sem</td>
                            <td class="py-3 px-3 text-right font-bold text-emerald-400">100% (Temps Plein)</td>
                        </tr>
                    `;
                } else {
                    rowsHtml = `<tr><td colspan="5" class="py-6 text-center text-gray-400 italic">En attente d'attribution de la classe titulaire par Sur École.</td></tr>`;
                }

                gridCells = `
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">07h30 - 09h10</td>
                        ${jours.map(j => j !== 'Samedi' ? `<td class="py-2 px-1 text-center"><div class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${classeTit || 'Primaire'}<br><span class="text-[9px] font-normal text-gray-400">Français / Math</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>').join('')}
                    </tr>
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">09h20 - 11h00</td>
                        ${jours.map(j => j !== 'Samedi' ? `<td class="py-2 px-1 text-center"><div class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${classeTit || 'Primaire'}<br><span class="text-[9px] font-normal text-gray-400">Éveil / Sciences</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>').join('')}
                    </tr>
                    <tr>
                        <td class="py-3 font-mono font-bold text-gray-400">11h30 - 12h30</td>
                        ${jours.map(j => j !== 'Samedi' ? `<td class="py-2 px-1 text-center"><div class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl px-2 py-1.5 font-black text-[11px]">${classeTit || 'Primaire'}<br><span class="text-[9px] font-normal text-gray-400">Civisme / Dessin</span></div></td>` : '<td class="py-2 text-center text-gray-600">-</td>').join('')}
                    </tr>
                `;
            }

            content.innerHTML = `
                <div class="flex items-start justify-between pb-6 border-b border-white/10 mb-6">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl ${db.ecoleActive === 'Harmonie' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'} flex items-center justify-center font-black text-xl shadow-inner">
                            ${(teacher.prenom[0]||'')+(teacher.nom[0]||'')}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-2xl font-black text-white uppercase">${teacher.prenom} ${teacher.nom}</h3>
                                <span class="px-2.5 py-0.5 rounded-full ${db.ecoleActive === 'Harmonie' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'} text-[10px] font-black uppercase">${db.ecoleActive}</span>
                            </div>
                            <p class="text-xs text-gray-400 mt-1">${teacher.email || 'enseignant@ecole.cd'} • <span class="text-gray-300 font-bold">${teacher.role}</span></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="printSingleTeacherWorkload('${encodeURIComponent(teacher.email || teacher.nom)}')" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer Fiche
                        </button>
                        <button onclick="document.getElementById('modal-teacher-workload').classList.add('hidden')" class="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume Hebdomadaire</p>
                        <p class="text-2xl font-black font-mono text-purple-300">${totalHeures}h <span class="text-xs font-normal text-gray-400">/ sem</span></p>
                    </div>
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Institution</p>
                        <p class="text-base font-black text-white mt-1">${db.ecoleActive}</p>
                    </div>
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Norme EPST</p>
                        <p class="text-sm font-black text-emerald-400 mt-1">${db.ecoleActive === 'Harmonie' ? '28h Titulaire' : '18h - 24h Prof'}</p>
                    </div>
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Statut Conformité</p>
                        <p class="text-sm font-black ${totalHeures >= 18 ? 'text-emerald-400' : 'text-amber-400'} mt-1">${totalHeures >= 18 ? '✓ Conforme' : '⏳ En Attente'}</p>
                    </div>
                </div>

                <!-- Tableau Ventilation par Classe -->
                <div class="mb-6">
                    <h4 class="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                        <i data-lucide="pie-chart" class="w-4 h-4 text-purple-400"></i> Ventilation de la Charge Horaire par Classe
                    </h4>
                    <div class="overflow-x-auto rounded-2xl border border-white/10">
                        <table class="w-full text-left text-xs bg-white/5">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10 pb-3">
                                <tr>
                                    <th class="py-3 px-3">Classe</th>
                                    <th class="py-3 px-3">Discipline / Cours</th>
                                    <th class="py-3 px-3">Jours & Horaires</th>
                                    <th class="py-3 px-3 text-center">Volume</th>
                                    <th class="py-3 px-3 text-right">Part (%)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Grille Hebdomadaire -->
                <div>
                    <h4 class="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4 text-blue-400"></i> Grille de l'Emploi du Temps Hebdomadaire
                    </h4>
                    <div class="overflow-x-auto rounded-2xl border border-white/10">
                        <table class="w-full text-left text-xs bg-white/5">
                            <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10">
                                <tr>
                                    <th class="py-3 px-2 w-28">Tranche</th>
                                    ${jours.map(j => `<th class="py-3 px-1 text-center font-black">${j}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 text-xs">
                                ${gridCells}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        };

        window.printSingleTeacherWorkload = function(teacherKey) {
            const content = document.getElementById('modal-teacher-workload-content');
            if (!content) return;
            const printWindow = window.open('', '', 'height=700,width=900');
            printWindow.document.write('<html><head><title>Fiche Individuelle de Charge Horaire</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; padding: 25px; color: #111; }');
            printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-size: 11px; }');
            printWindow.document.write('th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }');
            printWindow.document.write('th { background-color: #f0f0f0; text-transform: uppercase; font-size: 9px; }');
            printWindow.document.write('button { display: none !important; }');
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<h1>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO — EPST</h1>');
            printWindow.document.write('<h2>FICHE INDIVIDUELLE DE CHARGE HORAIRE PÉDAGOGIQUE</h2>');
            printWindow.document.write(content.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };

        window.createCompte = function(e) {
            e.preventDefault();
            const prenom = document.getElementById('new-prenom').value;
            const nom = document.getElementById('new-nom').value;
            const email = document.getElementById('new-email').value;
            const role = document.getElementById('new-role').value;
            const ecole = document.getElementById('new-ecole').value;
            const newId = Math.max(...db.rh.comptes.map(c => c.id)) + 1;
            const login = prenom[0].toUpperCase() + '.' + nom.toUpperCase();
            db.rh.comptes.push({ id: newId, nom, prenom, role, statut: 'Actif', ecole: ecole, email, classes: [], login });
            saveDb();
            document.getElementById('modal-create-compte').classList.add('hidden');
            renderRH();
            if (window.lucide) lucide.createIcons();
        };

        const btnAddCompte = document.getElementById('btn-add-compte');
        if (btnAddCompte) btnAddCompte.onclick = () => document.getElementById('modal-create-compte').classList.remove('hidden');
    }

    function renderCommunication() {
        const inst = db.institutions[db.ecoleActive];
        const templates = [
            { id: 'ret', label: '📅 Rappel Retard Frais Scolaires', body: 'Cher(e) Parent, nous vous informons que des frais scolaires restent impayés pour votre enfant. Merci de vous présenter au secrétariat. — Direction ' + db.ecoleActive },
            { id: 'abs', label: '⚠️ Alerte Absence Injustifiée', body: 'Cher(e) Parent, votre enfant a été absent(e) sans justification. Merci de contacter la Direction dans les 48h. — ' + db.ecoleActive },
            { id: 'exam', label: '📝 Rappel Examens EPST / EXETAT', body: 'Cher(e) Parent, les examens de fin d\'année commencent le [DATE]. Assurez-vous que votre enfant est prêt(e). — Direction ' + db.ecoleActive },
            { id: 'bul', label: '📊 Bulletin disponible en ligne', body: 'Cher(e) Parent, le bulletin du 2ème trimestre de votre enfant est disponible sur le portail HR. Connectez-vous sur hr-ecole.cd — Direction' },
            { id: 'reu', label: '🏫 Réunion des Parents d\'Élèves', body: 'Cher(e) Parent, une réunion générale est organisée le [DATE] à [HEURE]. Votre présence est fortement souhaitée. — Direction ' + db.ecoleActive },
        ];

        ui.content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Communication SMS & WhatsApp</h2>
                <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Plateforme de Communication Parentale EPST</p>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-3xl font-black text-purple-400 mb-1">${inst.comms.smsEnvoyes}</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">SMS ce mois</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-3xl font-black text-green-400 mb-1">${inst.comms.whatsappEnvoyes}</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp envoyés</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-3xl font-black text-amber-400 mb-1">98%</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taux de livraison</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-3xl font-black text-blue-400 mb-1">${inst.pedagogie.eleves.length}</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parents contactables</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Composer -->
                <div class="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/10">
                    <h3 class="font-black text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
                        <i data-lucide="send" class="w-5 h-5 text-purple-400"></i> Composer un Message
                    </h3>

                    <!-- Channel Selector -->
                    <div class="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
                        <button id="ch-sms" onclick="switchChannel('sms')" class="flex-1 py-2 text-xs font-black rounded-lg bg-purple-600 text-white shadow transition">📱 SMS</button>
                        <button id="ch-wa" onclick="switchChannel('wa')" class="flex-1 py-2 text-xs font-black rounded-lg text-gray-400 hover:text-white transition">💬 WhatsApp</button>
                        <button id="ch-both" onclick="switchChannel('both')" class="flex-1 py-2 text-xs font-black rounded-lg text-gray-400 hover:text-white transition">📡 SMS + WhatsApp</button>
                    </div>

                    <!-- Templates -->
                    <div class="mb-5">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Templates Prédéfinis EPST</label>
                        <select id="comm-template" onchange="loadTemplate()" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-purple-500">
                            <option value="">Choisir un template...</option>
                            ${templates.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Target -->
                    <div class="mb-5">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cible</label>
                        <select id="comm-target" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-purple-500">
                            <option value="tous">🌐 Tous les parents — ${db.ecoleActive}</option>
                            ${inst.pedagogie.classes.map(c => `<option value="${c}">Classe : ${c}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Message Body -->
                    <div class="mb-5">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Corps du message <span id="char-count" class="text-gray-500 font-normal normal-case">(0 / 160 car.)</span></label>
                        <textarea id="comm-body" rows="4" oninput="updateCharCount()" placeholder="Saisissez votre message ici..." class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 resize-none"></textarea>
                    </div>

                    <!-- Schedule Option -->
                    <div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs font-bold text-blue-300">📆 Planifier l'envoi</p>
                            <p class="text-[10px] text-gray-400">Programmer l'envoi automatique à une heure précise</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="datetime-local" class="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 outline-none">
                        </div>
                    </div>

                    <button onclick="sendCampaign()" class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition">
                        <i data-lucide="send" class="w-5 h-5"></i> Envoyer la Campagne
                    </button>
                </div>

                <!-- Right Panel: Automation + History -->
                <div class="space-y-6">
                    <!-- Automation Toggles -->
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 class="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i> Automatisations EPST
                        </h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-bold text-gray-200">SMS Rappel Retard</p>
                                    <p class="text-[10px] text-gray-400">Chaque lundi à 8h00</p>
                                </div>
                                <button onclick="toggleAuto('smsRetard', this)" class="w-10 h-5 rounded-full relative transition-all ${db.commsGlobal.autoSmsRetard ? 'bg-purple-600' : 'bg-gray-600'}" id="toggle-smsRetard">
                                    <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${db.commsGlobal.autoSmsRetard ? 'left-5' : 'left-0.5'}"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-bold text-gray-200">WhatsApp Rappel Examen</p>
                                    <p class="text-[10px] text-gray-400">J-3 avant chaque période</p>
                                </div>
                                <button onclick="toggleAuto('autoWaRappel', this)" class="w-10 h-5 rounded-full relative transition-all ${db.commsGlobal.autoWaRappel ? 'bg-green-600' : 'bg-gray-600'}" id="toggle-autoWaRappel">
                                    <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${db.commsGlobal.autoWaRappel ? 'left-5' : 'left-0.5'}"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-bold text-gray-200">Alerte Absence Auto</p>
                                    <p class="text-[10px] text-gray-400">Après 2 absences consécutives</p>
                                </div>
                                <button class="w-10 h-5 rounded-full relative transition-all bg-amber-600">
                                    <span class="absolute top-0.5 left-5 h-4 w-4 rounded-full bg-white shadow"></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Send History -->
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 class="font-black text-sm uppercase tracking-wider mb-4">Historique des Envois</h4>
                        <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
                            <div class="p-3 bg-white/5 border border-white/5 rounded-xl">
                                <p class="text-xs font-bold text-gray-200">SMS Rappel Frais — Tous</p>
                                <p class="text-[10px] text-gray-400">Envoyé à 47 parents • Il y a 3 jours</p>
                                <span class="text-[10px] text-green-400 font-bold">✓ Livré 100%</span>
                            </div>
                            <div class="p-3 bg-white/5 border border-white/5 rounded-xl">
                                <p class="text-xs font-bold text-gray-200">WhatsApp — Alerte Examens</p>
                                <p class="text-[10px] text-gray-400">Envoyé à 3ème Humanités • Il y a 1 semaine</p>
                                <span class="text-[10px] text-green-400 font-bold">✓ Livré 98%</span>
                            </div>
                            <div class="p-3 bg-white/5 border border-white/5 rounded-xl">
                                <p class="text-xs font-bold text-gray-200">SMS — Réunion Parents</p>
                                <p class="text-[10px] text-gray-400">Envoyé à 52 parents • Il y a 2 semaines</p>
                                <span class="text-[10px] text-amber-400 font-bold">⚠ Livré 91%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // JS for communication module
        const tmplData = {};
        templates.forEach(t => tmplData[t.id] = t.body);

        window.loadTemplate = function() {
            const sel = document.getElementById('comm-template');
            const body = document.getElementById('comm-body');
            if (sel && body && tmplData[sel.value]) {
                body.value = tmplData[sel.value];
                updateCharCount();
            }
        };

        window.updateCharCount = function() {
            const body = document.getElementById('comm-body');
            const counter = document.getElementById('char-count');
            if (body && counter) counter.textContent = `(${body.value.length} / 160 car.)`;
        };

        window.switchChannel = function(ch) {
            ['sms','wa','both'].forEach(c => {
                const btn = document.getElementById('ch-' + c);
                if (btn) btn.className = c === ch
                    ? 'flex-1 py-2 text-xs font-black rounded-lg bg-purple-600 text-white shadow transition'
                    : 'flex-1 py-2 text-xs font-black rounded-lg text-gray-400 hover:text-white transition';
            });
        };

        window.toggleAuto = function(key, btn) {
            db.commsGlobal[key] = !db.commsGlobal[key];
            saveDb();
            renderCommunication();
        };

        window.sendCampaign = function() {
            const target = document.getElementById('comm-target')?.value || 'tous';
            const body = document.getElementById('comm-body')?.value;
            if (!body || !body.trim()) { alert('Veuillez rédiger un message avant d\'envoyer.'); return; }
            alert(`✅ Campagne envoyée avec succès à : ${target}\n\nMessage : ${body.substring(0, 80)}...`);
            inst.comms.smsEnvoyes += 15;
            saveDb();
            renderCommunication();
        };
    }

    function renderCoffreFort() {
        const docs = [
            { name: 'Palmarès EXETAT 2025', type: 'pdf', size: '2.4 Mo', date: '2025-07-15', category: 'Académique', secured: true },
            { name: 'Rapport Financier Annuel 2025', type: 'xlsx', size: '1.8 Mo', date: '2025-08-01', category: 'Finance', secured: true },
            { name: 'Registre des Enseignants', type: 'pdf', size: '0.9 Mo', date: '2026-01-10', category: 'RH', secured: false },
            { name: 'Statuts & Agréments EPST', type: 'pdf', size: '3.1 Mo', date: '2024-09-01', category: 'Administratif', secured: true },
            { name: 'Correspondances PROVED', type: 'pdf', size: '0.5 Mo', date: '2026-05-18', category: 'Administratif', secured: false },
            { name: 'Bulletins Trimestre 1 (ZIP)', type: 'zip', size: '15.2 Mo', date: '2026-03-30', category: 'Académique', secured: true },
        ];
        const catColors = { Académique: 'bg-blue-500/20 text-blue-400 border-blue-500/30', Finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', RH: 'bg-amber-500/20 text-amber-400 border-amber-500/30', Administratif: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
        const typeIcons = { pdf: 'file-text', xlsx: 'sheet', zip: 'archive', doc: 'file' };

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Coffre-fort Numérique</h2>
                    <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Archives sécurisées — ${db.ecoleActive}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Chiffrement AES-256
                    </span>
                    <button onclick="document.getElementById('unlock-zone').classList.toggle('hidden')" class="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/30 transition flex items-center gap-1.5">
                        <i data-lucide="key" class="w-3.5 h-3.5"></i> Déverrouiller
                    </button>
                </div>
            </div>

            <!-- Unlock Panel -->
            <div id="unlock-zone" class="hidden mb-6">
                <div class="p-6 glass-panel rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <p class="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">Authentification Requise — Coffre-fort</p>
                    <div class="flex gap-3">
                        <input type="password" id="vault-pwd" placeholder="Mot de passe Maître" class="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-amber-500">
                        <button onclick="unlockVault()" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-xl text-sm transition">Confirmer</button>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-2xl font-black text-white mb-1">${docs.length}</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documents</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-2xl font-black text-amber-400 mb-1">${docs.filter(d => d.secured).length}</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sécurisés</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-2xl font-black text-emerald-400 mb-1">Auto</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sauvegarde</div>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-white/10 text-center">
                    <div class="text-2xl font-black text-blue-400 mb-1">24.9 Mo</div>
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stockage utilisé</div>
                </div>
            </div>

            <!-- Document Grid -->
            <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/10">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-black text-lg uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="archive" class="w-5 h-5 text-amber-400"></i> Documents & Archives
                    </h3>
                    <button class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i> Déposer un fichier
                    </button>
                </div>
                <div class="space-y-3">
                    ${docs.map(d => `
                        <div class="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition group">
                            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <i data-lucide="${typeIcons[d.type] || 'file'}" class="w-5 h-5 text-gray-300"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-white truncate">${d.name}</p>
                                <p class="text-[10px] text-gray-400 mt-0.5">${d.size} • ${d.date}</p>
                            </div>
                            <span class="px-2.5 py-1 text-[10px] font-black rounded-full border ${catColors[d.category] || 'bg-white/10 text-gray-400 border-white/10'} uppercase">${d.category}</span>
                            ${d.secured ? '<span class="text-amber-400 text-[10px] font-black flex items-center gap-0.5"><i data-lucide="lock" class="w-3 h-3"></i> Sécurisé</span>' : ''}
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button onclick="alert('Téléchargement de: ${d.name}')" class="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-lg" title="Télécharger">
                                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="alert('Suppression de: ${d.name}')" class="p-1.5 text-gray-400 hover:text-red-400 bg-white/10 rounded-lg" title="Supprimer">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        window.unlockVault = function() {
            const pwd = document.getElementById('vault-pwd')?.value;
            if (pwd === 'admin123' || pwd === 'password') {
                alert('✅ Coffre-fort déverrouillé ! Accès aux archives sensibles accordé.');
                document.getElementById('unlock-zone').classList.add('hidden');
            } else {
                alert('❌ Mot de passe incorrect. Tentative enregistrée dans le journal de sécurité.');
            }
        };
    }

    // ==========================================
    // RENDER: DOSSIER 360
    // ==========================================
    // RENDER: SUIVI DIRECTION
    // ==========================================
    function renderSuiviDirection() {
        const journal = (db.rh.journalDirection || []).filter(j => j.ecole === db.ecoleActive);
        const comptes = db.rh.comptes.filter(c => c.ecole === db.ecoleActive);
        const pointages = db.rh.pointages.filter(p => p.ecole === db.ecoleActive);

        const typeColors = {
            success: { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'check-circle', iconColor: 'text-green-600', badge: 'bg-green-100 text-green-700' },
            info:    { bg: 'bg-blue-100 dark:bg-blue-900/20',  icon: 'info',         iconColor: 'text-blue-600',  badge: 'bg-blue-100 text-blue-700' },
            warning: { bg: 'bg-amber-100 dark:bg-amber-900/20', icon: 'alert-triangle', iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
            error:   { bg: 'bg-red-100 dark:bg-red-900/20',   icon: 'x-circle',      iconColor: 'text-red-600',   badge: 'bg-red-100 text-red-700' }
        };

        const presenceRate = pointages.length > 0
            ? Math.round((pointages.filter(p => p.statut === 'Présent').length / pointages.length) * 100)
            : 0;

        ui.content.innerHTML = `
            <div class="mb-8 flex items-end justify-between">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Suivi de la Direction</h2>
                    <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Audit, activités et performance du personnel</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-black text-green-700 dark:text-green-400">Surveillance Active</span>
                </div>
            </div>

            <!-- KPIs Suivi -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <i data-lucide="users" class="w-5 h-5 text-blue-500"></i>
                        </div>
                        <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Personnel Actif</span>
                    </div>
                    <div class="text-3xl font-black dark:text-white">${comptes.filter(c => c.statut === 'Actif').length}</div>
                    <div class="text-xs text-gray-400 mt-1">sur ${comptes.length} total</div>
                </div>
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <i data-lucide="trending-up" class="w-5 h-5 text-green-500"></i>
                        </div>
                        <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Taux Présence</span>
                    </div>
                    <div class="text-3xl font-black dark:text-white">${presenceRate}<span class="text-base font-normal text-gray-400">%</span></div>
                    <div class="text-xs text-gray-400 mt-1">Aujourd'hui</div>
                </div>
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <i data-lucide="clock" class="w-5 h-5 text-amber-500"></i>
                        </div>
                        <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Retards</span>
                    </div>
                    <div class="text-3xl font-black text-amber-500">${pointages.filter(p => p.statut === 'Retard').length}</div>
                    <div class="text-xs text-gray-400 mt-1">Ce matin</div>
                </div>
                <div class="glass-panel p-6 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <i data-lucide="activity" class="w-5 h-5 text-purple-500"></i>
                        </div>
                        <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Actions Journal</span>
                    </div>
                    <div class="text-3xl font-black dark:text-white">${journal.length}</div>
                    <div class="text-xs text-gray-400 mt-1">Enregistrées</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Journal d'activités (timeline) -->
                <div class="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-black text-lg uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="activity" class="w-5 h-5 text-brand-500"></i>
                            Journal d'Activité — Direction
                        </h3>
                        <span class="text-xs text-gray-400 font-bold">Temps réel</span>
                    </div>

                    <div class="relative">
                        <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10 dark:bg-gray-700"></div>
                        <div class="space-y-4">
                            ${journal.length === 0
                                ? '<p class="text-center text-gray-400 italic py-10 ml-10">Aucune activité enregistrée.</p>'
                                : journal.map(j => {
                                    const t = typeColors[j.type] || typeColors.info;
                                    return `
                                    <div class="flex gap-4 relative">
                                        <div class="w-10 h-10 rounded-full ${t.bg} flex items-center justify-center flex-shrink-0 z-10 border-2 border-white dark:border-gray-900">
                                            <i data-lucide="${t.icon}" class="w-4 h-4 ${t.iconColor}"></i>
                                        </div>
                                        <div class="flex-1 p-4 bg-[#112240]/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                            <div class="flex items-start justify-between gap-2">
                                                <div>
                                                    <p class="font-black text-sm dark:text-white">${j.action}</p>
                                                    <p class="text-xs text-gray-500 mt-1">${j.detail}</p>
                                                </div>
                                                <div class="text-right flex-shrink-0">
                                                    <p class="text-[10px] font-mono text-gray-400">${j.heure}</p>
                                                    <p class="text-[10px] text-gray-400">${j.date}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2 mt-3">
                                                <div class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-black">${j.auteur[0]}</div>
                                                <span class="text-[11px] font-bold text-gray-500">${j.auteur}</span>
                                                <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${t.badge}">${j.type}</span>
                                            </div>
                                        </div>
                                    </div>`;
                                }).join('')
                            }
                        </div>
                    </div>
                </div>

                <!-- Panel droite: Performance + Alertes -->
                <div class="space-y-6">

                    <!-- Performance par rôle -->
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 class="font-black uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
                            <i data-lucide="bar-chart-3" class="w-4 h-4 text-brand-500"></i> Performance du Jour
                        </h4>
                        <div class="space-y-4">
                            ${['Direction','Enseignant','Préfet','Comptable'].map(role => {
                                const rolePointages = pointages.filter(p => p.role === role);
                                const present = rolePointages.filter(p => p.statut === 'Présent').length;
                                const total = rolePointages.length;
                                const pct = total > 0 ? Math.round((present/total)*100) : 0;
                                const colors = { Direction:'amber', Enseignant:'blue', Préfet:'purple', Comptable:'green' };
                                const c = colors[role] || 'gray';
                                return `
                                <div>
                                    <div class="flex justify-between items-center mb-1.5">
                                        <span class="text-xs font-bold text-gray-600 dark:text-gray-300">${role}</span>
                                        <span class="text-xs font-black text-${c}-600">${pct}%</span>
                                    </div>
                                    <div class="h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div class="h-full bg-${c}-500 rounded-full transition-all duration-500" style="width:${pct}%"></div>
                                    </div>
                                    <div class="text-[10px] text-gray-400 mt-1">${present}/${total} présents</div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Alertes -->
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 class="font-black uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
                            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i> Alertes Admin
                        </h4>
                        <div class="space-y-3">
                            ${pointages.filter(p => p.statut === 'Absent').length > 0 ? `
                                <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <p class="text-xs font-black text-red-700 dark:text-red-400">🔴 ${pointages.filter(p=>p.statut==='Absent').length} absence(s) non justifiée(s) aujourd'hui</p>
                                    <p class="text-[10px] text-red-500 mt-1">${pointages.filter(p=>p.statut==='Absent').map(p=>p.nom).join(', ')}</p>
                                </div>` : ''}
                            ${pointages.filter(p => p.statut === 'Retard').length > 0 ? `
                                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <p class="text-xs font-black text-amber-700 dark:text-amber-400">🟡 ${pointages.filter(p=>p.statut==='Retard').length} retard(s) enregistré(s)</p>
                                    <p class="text-[10px] text-amber-500 mt-1">${pointages.filter(p=>p.statut==='Retard').map(p=>p.nom).join(', ')}</p>
                                </div>` : ''}
                            <div class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <p class="text-xs font-black text-green-700 dark:text-green-400">✅ Système de surveillance actif</p>
                                <p class="text-[10px] text-green-500 mt-1">Toutes les activités sont enregistrées</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions rapides admin -->
                    <div class="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 class="font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <i data-lucide="zap" class="w-4 h-4 text-brand-500"></i> Actions Rapides
                        </h4>
                        <div class="space-y-2">
                            <button onclick="alert('Rapport exporté !')" class="w-full flex items-center gap-3 p-3 bg-[#112240]/50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
                                <i data-lucide="download" class="w-4 h-4 text-gray-400 group-hover:text-brand-600"></i>
                                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600">Exporter le journal PDF</span>
                            </button>
                            <button onclick="alert('Rapport envoyé par email !')" class="w-full flex items-center gap-3 p-3 bg-[#112240]/50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
                                <i data-lucide="mail" class="w-4 h-4 text-gray-400 group-hover:text-brand-600"></i>
                                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600">Envoyer rapport par email</span>
                            </button>
                            <button onclick="currentView='rh'; renderView();" class="w-full flex items-center gap-3 p-3 bg-[#112240]/50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
                                <i data-lucide="users" class="w-4 h-4 text-gray-400 group-hover:text-brand-600"></i>
                                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600">Gérer les comptes RH</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // RENDER: DOSSIER 360
    // ==========================================
    function renderDossier360() {
        const inst = db.institutions[db.ecoleActive];
        const classes = inst.pedagogie.classes;
        const isRetrouvailles = db.ecoleActive === 'Retrouvailles';

        // Build group UI: cascade for Retrouvailles, simple dropdown for Harmonie
        let groupOptionsHtml = '';
        if (isRetrouvailles) {
            const eb = classes.filter(c => c.includes('EB'));
            const hum = classes.filter(c => c.includes('Humanités'));
            const optionsTech = inst.pedagogie.optionsTech;
            const optionsNonTech = inst.pedagogie.optionsNonTech;

            // Step 1: all classes
            const allClassesOptions = [
                `<option value="" disabled selected>Choisir la classe...</option>`,
                `<optgroup label="🌐 Diffusion Générale">`,
                `<option value="tous">Tous les élèves — G.S. Retrouvailles</option>`,
                `</optgroup>`,
                `<optgroup label="📚 Enseignement de Base">`,
                ...eb.map(c => `<option value="${c}">${c}</option>`),
                `</optgroup>`,
                `<optgroup label="🎓 Humanités">`,
                ...hum.map(c => `<option value="${c}">${c}</option>`),
                `</optgroup>`
            ].join('');

            // Step 3 options per section
            const techOptions = optionsTech.map(o => `<option value="${o}">${o}</option>`).join('');
            const nonTechOptions = optionsNonTech.map(o => `<option value="${o}">${o}</option>`).join('');

            groupOptionsHtml = `
                <div class="space-y-3">

                    <!-- Étape 1: Classe -->
                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            Étape 1 — Classe
                        </label>
                        <select id="cascade-classe" class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
                            ${allClassesOptions}
                        </select>
                    </div>

                    <!-- Étape 2: Section (uniquement pour Humanités) -->
                    <div id="cascade-section-wrap" class="hidden transition-all">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            Étape 2 — Section
                        </label>
                        <div class="flex gap-2">
                            <button type="button" data-sec="Technique"
                                class="cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-black text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all text-center">
                                📘 Technique
                            </button>
                            <button type="button" data-sec="Non Technique"
                                class="cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-black text-gray-500 dark:text-gray-400 hover:border-green-400 hover:text-green-600 transition-all text-center">
                                📗 Non Technique
                            </button>
                        </div>
                        <input type="hidden" id="cascade-section-val" value="">
                    </div>

                    <!-- Étape 3: Option -->
                    <div id="cascade-option-wrap" class="hidden transition-all">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            Étape 3 — Option
                        </label>
                        <select id="cascade-option" class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
                            <option value="" disabled selected>Choisir une option...</option>
                            <optgroup id="cascade-option-tech" label="Options Techniques" style="display:none">${techOptions}</optgroup>
                            <optgroup id="cascade-option-nontech" label="Options Non Techniques" style="display:none">${nonTechOptions}</optgroup>
                        </select>
                    </div>

                    <!-- Résumé de la sélection -->
                    <div id="cascade-summary" class="hidden p-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300">
                        🎯 Cible : <span id="cascade-summary-text"></span>
                    </div>
                </div>
            `;
        } else {
            // Harmonie: simple dropdown with Maternelle + Primaire
            const mat = classes.filter(c => c.includes('Maternelle'));
            const prim = classes.filter(c => c.includes('Primaire'));
            groupOptionsHtml = `
                <select class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
                    <option disabled selected>Sélectionnez la classe cible...</option>
                    <optgroup label="🌐 Diffusion Générale">
                        <option>Tous les élèves — C.S. Harmonie</option>
                        <option>Toutes les Maternelles</option>
                        <option>Toutes les Primaires</option>
                    </optgroup>
                    <optgroup label="Section Maternelle">
                        ${mat.map(c => `<option>${c}</option>`).join('')}
                    </optgroup>
                    <optgroup label="Section Primaire">
                        ${prim.map(c => `<option>${c}</option>`).join('')}
                    </optgroup>
                </select>
            `;
        }

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Dossier 360° (Parents)</h2>
                    <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Rechercher et visualiser la fiche de l'élève telle que vue par le parent</p>
                </div>
            </div>
            <div class="glass-panel p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
                <h3 class="text-xl font-bold mb-6 dark:text-white">Recherche d'un dossier élève</h3>
                <div class="flex gap-4 max-w-2xl mb-8">
                    <input type="text" id="search-eleve-360" placeholder="Entrez le nom de l'élève (ex: MUKENDI KABUYA)" class="flex-1 px-4 py-3 bg-white/10 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <button onclick="window.location.href='/parent-dashboard.html'" class="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 transition-all shadow-lg">Consulter le dossier</button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                        <i data-lucide="line-chart" class="w-8 h-8 text-blue-500 mb-4"></i>
                        <h4 class="font-bold mb-2 dark:text-white">Suivi Académique</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Consultez les moyennes, l'évolution et les bulletins de l'élève.</p>
                    </div>
                    <div class="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                        <i data-lucide="wallet" class="w-8 h-8 text-amber-500 mb-4"></i>
                        <h4 class="font-bold mb-2 dark:text-white">Situation Financière</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Vérifiez les paiements, minervals et l'état des frais divers.</p>
                    </div>
                    <div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800/50">
                        <i data-lucide="user-check" class="w-8 h-8 text-green-500 mb-4"></i>
                        <h4 class="font-bold mb-2 dark:text-white">Assiduité & Conduite</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Passez en revue les présences, absences et notes de conduite.</p>
                    </div>
                </div>

                <!-- NOUVEAU: Espace d'envoi aux parents -->
                <div class="mt-12 pt-10 border-t border-white/10">
                    <h3 class="text-xl font-bold mb-2 dark:text-white flex items-center gap-2">
                        <i data-lucide="send" class="w-6 h-6 text-brand-500"></i> Partager des informations avec les parents
                    </h3>
                    <p class="text-sm text-gray-500 mb-8">Mettez à jour le portail des parents en leur envoyant de nouvelles données (devoirs, alertes de conduite, rappels financiers).</p>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Formulaire d'envoi -->
                        <div class="bg-[#112240]/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <form id="form-send-parent" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type d'information</label>
                                    <select class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                                        <option>Nouveau Devoir / Cahier de texte</option>
                                        <option>Note d'Évaluation</option>
                                        <option>Alerte Assiduité / Conduite</option>
                                        <option>Rappel Financier</option>
                                        <option>Message Général</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Cible de la communication</label>
                                    
                                    <!-- Premium Toggle -->
                                    <div class="flex bg-white/10 dark:bg-gray-900/50 p-1.5 rounded-2xl mb-4 w-fit shadow-inner border border-gray-200 dark:border-gray-700">
                                        <button type="button" id="btn-target-indiv" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-800 shadow-md text-brand-600 scale-105">Individuel (Élève)</button>
                                        <button type="button" id="btn-target-group" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Groupe (Classe)</button>
                                    </div>
                                    
                                    <!-- Input for Individual -->
                                    <div id="target-individual" class="animate-fade-in">
                                        <input type="text" placeholder="Rechercher l'élève (Ex: MUKENDI KABUYA)" class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                                    </div>
                                    
                                    <!-- Select for Group -->
                                    <div id="target-group" class="hidden animate-fade-in">
                                        ${groupOptionsHtml}
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Détails / Contenu</label>
                                    <textarea rows="3" placeholder="Saisissez le contenu à envoyer..." class="w-full px-4 py-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"></textarea>
                                </div>

                                <!-- Zone d'upload pièce jointe -->
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pièce Jointe <span class="text-gray-400 font-normal normal-case">(optionnel)</span></label>
                                    
                                    <div id="upload-zone"
                                        class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-all group"
                                        onclick="document.getElementById('file-input-parent').click()">
                                        
                                        <input type="file" id="file-input-parent" class="hidden" accept="image/*,.pdf,.doc,.docx">
                                        
                                        <!-- Icône centrale -->
                                        <div class="flex flex-col items-center gap-3">
                                            <div class="w-14 h-14 rounded-2xl bg-white/10 dark:bg-gray-700 flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-all">
                                                <i data-lucide="upload-cloud" class="w-7 h-7 text-gray-400 group-hover:text-brand-500 transition-colors"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Glissez votre fichier ici</p>
                                                <p class="text-xs text-gray-400 mt-1">ou <span class="text-brand-500 font-bold underline-offset-2 underline">cliquez pour parcourir</span></p>
                                            </div>
                                            <div class="flex gap-2 flex-wrap justify-center mt-1">
                                                <span class="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">📷 Image</span>
                                                <span class="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-black rounded-full uppercase tracking-wider">📄 PDF</span>
                                                <span class="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">📝 Word</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Prévisualisation du fichier sélectionné -->
                                    <div id="file-preview" class="hidden mt-3 p-3 bg-[#112240]/80 dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-3">
                                        <div id="file-preview-icon" class="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                                            <i data-lucide="file" class="w-5 h-5 text-brand-600"></i>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p id="file-preview-name" class="text-sm font-bold text-gray-800 dark:text-white truncate"></p>
                                            <p id="file-preview-size" class="text-xs text-gray-400 mt-0.5"></p>
                                        </div>
                                        <button type="button" id="file-remove-btn" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                                            <i data-lucide="x" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>

                                <button type="button" onclick="alert('Informations envoyées avec succès sur le portail du parent !')" class="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg mt-4">
                                    <i data-lucide="upload-cloud" class="w-5 h-5"></i> Publier sur l'Espace Parent
                                </button>
                            </form>
                        </div>
                        
                        <!-- Historique d'envoi -->
                        <div class="bg-[#112240]/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <h4 class="font-bold text-gray-700 dark:text-white mb-6 uppercase tracking-wider text-sm border-b dark:border-gray-700 pb-2">Derniers envois</h4>
                            <div class="space-y-4">
                                <div class="p-4 bg-[#112240]/80 dark:bg-[#112240] rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div class="p-2 bg-amber-100 text-amber-600 rounded-lg"><i data-lucide="book-open" class="w-4 h-4"></i></div>
                                    <div>
                                        <p class="text-sm font-bold dark:text-white">Devoir de Mathématiques</p>
                                        <p class="text-xs text-gray-500">Envoyé à: 3ème Humanité (Scientifique)</p>
                                        <p class="text-[10px] text-gray-400 mt-1 font-mono">Il y a 2 heures</p>
                                    </div>
                                </div>
                                <div class="p-4 bg-[#112240]/80 dark:bg-[#112240] rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div class="p-2 bg-red-100 text-red-600 rounded-lg"><i data-lucide="alert-triangle" class="w-4 h-4"></i></div>
                                    <div>
                                        <p class="text-sm font-bold dark:text-white">Alerte Retard</p>
                                        <p class="text-xs text-gray-500">Envoyé à: Parent de MUKENDI KABUYA</p>
                                        <p class="text-[10px] text-gray-400 mt-1 font-mono">Aujourd'hui, 08:45</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Logic for toggling target type + cascade for Retrouvailles
        setTimeout(() => {
            const btnIndiv = document.getElementById('btn-target-indiv');
            const btnGroup = document.getElementById('btn-target-group');
            const targetIndiv = document.getElementById('target-individual');
            const targetGroup = document.getElementById('target-group');

            if (btnIndiv && btnGroup) {
                btnIndiv.onclick = () => {
                    targetIndiv.classList.remove('hidden');
                    targetGroup.classList.add('hidden');
                    btnIndiv.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-800 shadow-md text-brand-600 scale-105";
                    btnGroup.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
                };
                btnGroup.onclick = () => {
                    targetGroup.classList.remove('hidden');
                    targetIndiv.classList.add('hidden');
                    btnGroup.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-800 shadow-md text-brand-600 scale-105";
                    btnIndiv.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
                };
            }

            // Cascade logic for Retrouvailles
            const cascadeClasse = document.getElementById('cascade-classe');
            const sectionWrap = document.getElementById('cascade-section-wrap');
            const optionWrap = document.getElementById('cascade-option-wrap');
            const sectionVal = document.getElementById('cascade-section-val');
            const cascadeOption = document.getElementById('cascade-option');
            const summary = document.getElementById('cascade-summary');
            const summaryText = document.getElementById('cascade-summary-text');
            const secBtns = document.querySelectorAll('.cascade-sec-btn');
            const optionTechGroup = document.getElementById('cascade-option-tech');
            const optionNonTechGroup = document.getElementById('cascade-option-nontech');

            function updateSummary() {
                const cls = cascadeClasse ? cascadeClasse.value : '';
                const sec = sectionVal ? sectionVal.value : '';
                const opt = cascadeOption ? cascadeOption.value : '';
                if (!cls) return;
                let txt = cls;
                if (sec) txt += ` — ${sec}`;
                if (opt) txt += ` — ${opt}`;
                if (summaryText) summaryText.textContent = txt;
                if (summary) summary.classList.remove('hidden');
            }

            if (cascadeClasse) {
                cascadeClasse.onchange = () => {
                    const val = cascadeClasse.value;
                    const isHum = val.includes('Humanités');
                    // Reset downstream
                    if (sectionWrap) sectionWrap.classList.toggle('hidden', !isHum);
                    if (optionWrap) optionWrap.classList.add('hidden');
                    if (sectionVal) sectionVal.value = '';
                    if (cascadeOption) cascadeOption.value = '';
                    if (summary) summary.classList.add('hidden');
                    secBtns.forEach(b => {
                        b.className = "cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-black text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all text-center";
                    });
                    if (!isHum && val && val !== 'tous') updateSummary();
                };
            }

            secBtns.forEach(btn => {
                btn.onclick = () => {
                    const sec = btn.dataset.sec;
                    if (sectionVal) sectionVal.value = sec;
                    // Highlight active button
                    secBtns.forEach(b => {
                        b.className = "cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-black text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all text-center";
                    });
                    btn.className = sec === 'Technique'
                        ? "cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-sm font-black text-blue-600 transition-all text-center"
                        : "cascade-sec-btn flex-1 py-3 px-4 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-900/30 text-sm font-black text-green-600 transition-all text-center";
                    // Show options
                    if (optionWrap) optionWrap.classList.remove('hidden');
                    if (optionTechGroup) optionTechGroup.style.display = sec === 'Technique' ? '' : 'none';
                    if (optionNonTechGroup) optionNonTechGroup.style.display = sec === 'Non Technique' ? '' : 'none';
                    if (cascadeOption) cascadeOption.value = '';
                    if (summary) summary.classList.add('hidden');
                };
            });

            if (cascadeOption) {
                cascadeOption.onchange = () => updateSummary();
            }

            // File upload logic
            const fileInput = document.getElementById('file-input-parent');
            const uploadZone = document.getElementById('upload-zone');
            const filePreview = document.getElementById('file-preview');
            const filePreviewName = document.getElementById('file-preview-name');
            const filePreviewSize = document.getElementById('file-preview-size');
            const filePreviewIcon = document.getElementById('file-preview-icon');
            const fileRemoveBtn = document.getElementById('file-remove-btn');

            function formatFileSize(bytes) {
                if (bytes < 1024) return bytes + ' B';
                if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
                return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
            }

            function getFileIcon(name) {
                const ext = name.split('.').pop().toLowerCase();
                if (['jpg','jpeg','png','gif','webp','bmp'].includes(ext)) return { icon: 'image', color: 'bg-blue-100 text-blue-600' };
                if (ext === 'pdf') return { icon: 'file-text', color: 'bg-red-100 text-red-600' };
                if (['doc','docx'].includes(ext)) return { icon: 'file-text', color: 'bg-blue-100 text-blue-700' };
                return { icon: 'file', color: 'bg-white/10 text-gray-600' };
            }

            function showPreview(file) {
                const { icon, color } = getFileIcon(file.name);
                if (filePreviewName) filePreviewName.textContent = file.name;
                if (filePreviewSize) filePreviewSize.textContent = formatFileSize(file.size);
                if (filePreviewIcon) {
                    filePreviewIcon.className = `w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`;
                    filePreviewIcon.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;
                }
                if (filePreview) filePreview.classList.remove('hidden');
                if (uploadZone) uploadZone.classList.add('border-brand-400', 'bg-brand-50/30');
                if (window.lucide) lucide.createIcons();
            }

            function clearFile() {
                if (fileInput) fileInput.value = '';
                if (filePreview) filePreview.classList.add('hidden');
                if (uploadZone) uploadZone.classList.remove('border-brand-400', 'bg-brand-50/30');
            }

            if (fileInput) {
                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) showPreview(file);
                };
            }

            if (fileRemoveBtn) {
                fileRemoveBtn.onclick = (e) => { e.stopPropagation(); clearFile(); };
            }

            // Drag & drop support
            if (uploadZone) {
                uploadZone.ondragover = (e) => {
                    e.preventDefault();
                    uploadZone.classList.add('border-brand-500', 'bg-brand-50/50', 'scale-[1.01]');
                };
                uploadZone.ondragleave = () => {
                    uploadZone.classList.remove('border-brand-500', 'bg-brand-50/50', 'scale-[1.01]');
                };
                uploadZone.ondrop = (e) => {
                    e.preventDefault();
                    uploadZone.classList.remove('border-brand-500', 'bg-brand-50/50', 'scale-[1.01]');
                    const file = e.dataTransfer.files[0];
                    if (file) { if (fileInput) fileInput.files = e.dataTransfer.files; showPreview(file); }
                };
            }
        }, 100);
    }

    // ==========================================
    // VUE: GESTION DES COMPTES
    // ==========================================
    function renderGestionComptes() {
        let db = JSON.parse(localStorage.getItem('hr_users_db_v2')) || [];
        
        window.editUser = function(id) {
            const u = db.find(x => x.id == id);
            if (!u) return;
            const newEmail = prompt(`Modifier l'email pour ${u.prenom} ${u.nom}`, u.email);
            if (newEmail !== null && newEmail.trim() !== '') {
                u.email = newEmail.trim();
            }
            const newPwd = prompt(`Modifier le mot de passe pour ${u.prenom} ${u.nom}`, u.password);
            if (newPwd !== null && newPwd.trim() !== '') {
                u.password = newPwd.trim();
            }
            localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
            alert('Compte mis à jour avec succès.');
            renderGestionComptes(); // refresh view
        };

        window.deleteUser = function(id) {
            if (id == 1) {
                alert("Vous ne pouvez pas supprimer le Super-Admin.");
                return;
            }
            if (confirm("Voulez-vous vraiment supprimer ce compte ?")) {
                db = db.filter(x => x.id != id);
                localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
                alert('Compte supprimé.');
                renderGestionComptes();
            }
        };

        let rows = '';
        db.forEach(u => {
            rows += `
                <tr class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td class="py-3 px-4 font-bold text-sm text-gray-900 dark:text-white">${u.prenom || ''} ${u.nom || ''}</td>
                    <td class="py-3 px-4 text-xs text-gray-500 font-mono">${u.email}</td>
                    <td class="py-3 px-4 text-xs font-bold text-amber-500">${u.role}</td>
                    <td class="py-3 px-4 text-xs text-gray-400">${u.ecole || 'N/A'}</td>
                    <td class="py-3 px-4 text-xs text-gray-400 font-mono">${u.password}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                        <button onclick="editUser(${u.id})" class="px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition text-xs font-bold">Modifier</button>
                        <button onclick="deleteUser(${u.id})" class="px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-xs font-bold">Supprimer</button>
                    </td>
                </tr>
            `;
        });

        ui.content.innerHTML = `
            <div class="mb-8 fade-in">
                <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Gestion des Comptes</h2>
                <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Administration des utilisateurs et réinitialisation des accès</p>
            </div>

            <div class="glass-panel dark:bg-gray-800 rounded-xl p-6 shadow-sm fade-in" style="animation-delay: 0.1s">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th class="pb-3 px-4">Utilisateur</th>
                                <th class="pb-3 px-4">Email</th>
                                <th class="pb-3 px-4">Rôle</th>
                                <th class="pb-3 px-4">École</th>
                                <th class="pb-3 px-4">Mot de passe</th>
                                <th class="pb-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // RENDER: RAPPORT DE PRÉSENCE JOURNALIÈRE DÉDIÉ (SUPER-ADMIN)
    // ==========================================
    function renderPresenceJournaliere() {
        const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const todayIso = new Date().toISOString().split('T')[0];
        const allPointages = db.rh.pointages.filter(p => p.ecole === db.ecoleActive || db.ecoleActive === 'Tous');
        const presentCount = allPointages.filter(p => p.statut === 'Présent' || p.statut === 'Terminé').length;
        const retardCount = allPointages.filter(p => p.statut === 'Retard').length;
        const absentCount = allPointages.filter(p => p.statut === 'Absent').length;
        const totalStaff = allPointages.length;
        const rate = totalStaff > 0 ? Math.round((presentCount / totalStaff) * 100) : 0;

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <i data-lucide="calendar-check" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-white uppercase tracking-tight">Rapport de Présence Journalière</h2>
                            <p class="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">${db.ecoleActive} — Registre Officiel • ${today}</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-wrap items-center gap-3">
                    <button onclick="window.openPresenceScanner ? window.openPresenceScanner() : alert('Initialisation du capteur facial...')" 
                        class="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105">
                        <i data-lucide="camera" class="w-4 h-4"></i> Scanner Facial (Pointage)
                    </button>
                    <button onclick="printDailyPresenceReport('${db.ecoleActive}')" 
                        class="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs flex items-center gap-2 border border-white/15 transition shadow-lg">
                        <i data-lucide="printer" class="w-4 h-4 text-emerald-400"></i> Imprimer Rapport A4
                    </button>
                    <button onclick="exportPresenceCSV('${db.ecoleActive}')" 
                        class="px-5 py-3 bg-white/5 hover:bg-white/10 text-cyan-300 font-bold rounded-2xl text-xs flex items-center gap-2 border border-white/10 transition shadow-lg">
                        <i data-lucide="file-spreadsheet" class="w-4 h-4 text-cyan-400"></i> Exporter CSV
                    </button>
                </div>
            </div>

            <!-- KPI Cards Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Taux d'Assiduité</span>
                        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
                            %
                        </div>
                    </div>
                    <div class="text-3xl font-black text-white">${rate}%</div>
                    <div class="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style="width: ${rate}%"></div>
                    </div>
                </div>

                <div class="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Présents</span>
                        <i data-lucide="user-check" class="w-5 h-5 text-emerald-400"></i>
                    </div>
                    <div class="text-3xl font-black text-emerald-400">${presentCount}</div>
                    <p class="text-[10px] text-gray-400 mt-2 font-medium">Arrivées validées à l'heure</p>
                </div>

                <div class="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-amber-400 uppercase tracking-widest">Retards</span>
                        <i data-lucide="clock" class="w-5 h-5 text-amber-400"></i>
                    </div>
                    <div class="text-3xl font-black text-amber-400">${retardCount}</div>
                    <p class="text-[10px] text-gray-400 mt-2 font-medium">Arrivées après 08h00</p>
                </div>

                <div class="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-rose-400 uppercase tracking-widest">Absents</span>
                        <i data-lucide="user-x" class="w-5 h-5 text-rose-400"></i>
                    </div>
                    <div class="text-3xl font-black text-rose-400">${absentCount}</div>
                    <p class="text-[10px] text-gray-400 mt-2 font-medium">Non pointés ce jour</p>
                </div>
            </div>

            <!-- Registre Table with Filters -->
            <div class="glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/10 bg-[#0A192F]/80">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 class="font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="list-checks" class="w-5 h-5 text-emerald-400"></i> Registre Détaillé des Pointages
                        </h3>
                        <p class="text-xs text-gray-400 mt-0.5">Historique des entrées et sorties en temps réel</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <div class="relative">
                            <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                            <input type="text" id="presence-search-input" oninput="filterPresenceTable(this.value)" placeholder="Rechercher un agent..." 
                                class="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 transition" />
                        </div>
                        <button onclick="filterPresenceByStatus('all')" class="presence-filter-btn active px-3 py-2 bg-emerald-500 text-gray-950 font-black rounded-xl text-xs transition">Tous (${totalStaff})</button>
                        <button onclick="filterPresenceByStatus('Présent')" class="presence-filter-btn px-3 py-2 bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/10 rounded-xl text-xs font-bold transition">Présents (${presentCount})</button>
                        <button onclick="filterPresenceByStatus('Retard')" class="presence-filter-btn px-3 py-2 bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10 rounded-xl text-xs font-bold transition">Retards (${retardCount})</button>
                        <button onclick="filterPresenceByStatus('Absent')" class="presence-filter-btn px-3 py-2 bg-white/5 hover:bg-white/10 text-rose-400 border border-white/10 rounded-xl text-xs font-bold transition">Absents (${absentCount})</button>
                    </div>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-white/5">
                    <table class="w-full text-left" id="main-presence-table">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-white/10 bg-white/5">
                            <tr>
                                <th class="py-4 px-4">Agent / Personnel</th>
                                <th class="py-4 px-4">Rôle Institutionnel</th>
                                <th class="py-4 px-4">Établissement</th>
                                <th class="py-4 px-4">Arrivée</th>
                                <th class="py-4 px-4">Départ</th>
                                <th class="py-4 px-4">Mécanisme</th>
                                <th class="py-4 px-4">Statut</th>
                                <th class="py-4 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5 text-sm" id="presence-table-tbody">
                            ${allPointages.map(p => {
                                const isLate = p.statut === 'Retard';
                                const isAbsent = p.statut === 'Absent';
                                const statusClass = isAbsent 
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                                    : (isLate 
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30');
                                const roleColorsMap = {
                                    'Direction': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Directeur Général': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Enseignant': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                                    'Préfet': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                                    'Comptable': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                };
                                const roleBadge = roleColorsMap[p.role] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';

                                return `
                                    <tr class="hover:bg-white/5 transition-colors presence-row" data-statut="${p.statut}" data-name="${p.nom.toLowerCase()}">
                                        <td class="py-4 px-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-sm shadow-md">
                                                    ${p.nom.split(' ').map(n=>n[0]).join('').slice(0,2)}
                                                </div>
                                                <div>
                                                    <p class="font-bold text-white leading-tight">${p.nom}</p>
                                                    <p class="text-xs text-gray-400 font-mono">ID-${String(p.id).padStart(4,'0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 px-4">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleBadge}">
                                                ${p.role || 'Agent'}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4 text-xs font-semibold text-gray-300">${p.ecole || db.ecoleActive}</td>
                                        <td class="py-4 px-4 font-mono font-bold ${isAbsent ? 'text-gray-500' : 'text-emerald-300'}">
                                            ${p.arrivee || '—'}
                                        </td>
                                        <td class="py-4 px-4 font-mono font-bold ${p.statut === 'Terminé' ? 'text-blue-300' : 'text-gray-500'}">
                                            ${p.depart || (p.statut === 'Terminé' ? '16:30' : 'En poste')}
                                        </td>
                                        <td class="py-4 px-4">
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-cyan-300">
                                                <i data-lucide="scan-face" class="w-3.5 h-3.5 text-cyan-400"></i> Facial IA
                                            </span>
                                        </td>
                                        <td class="py-4 px-4">
                                            <span class="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide inline-flex items-center gap-1.5 ${statusClass}">
                                                <span class="w-1.5 h-1.5 rounded-full ${isAbsent ? 'bg-rose-400' : isLate ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
                                                ${p.statut}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4 text-right">
                                            <div class="flex items-center justify-end gap-1.5">
                                                <button title="Envoyer Rappel SMS" onclick="alert('Notification SMS envoyée à ${p.nom}')" 
                                                    class="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-amber-400 transition">
                                                    <i data-lucide="message-square" class="w-4 h-4"></i>
                                                </button>
                                                <button title="Fiche Individuelle" onclick="printIndividualPresence('${p.nom}', '${p.role}', '${p.arrivee}', '${p.statut}')" 
                                                    class="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-emerald-400 transition">
                                                    <i data-lucide="file-text" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();
    }

    // ==========================================
    // HELPERS: RAPPORT OFFICIEL & EXPORT
    // ==========================================
    window.printDailyPresenceReport = function(ecole) {
        const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const instName = ecole === 'Retrouvailles' ? 'GROUPE SCOLAIRE RETROUVAILLES' : 'COMPLEXE SCOLAIRE HARMONIE';
        const allPointages = db.rh.pointages.filter(p => p.ecole === ecole || ecole === 'Tous');
        const presents = allPointages.filter(p => p.statut === 'Présent' || p.statut === 'Terminé').length;
        const retards = allPointages.filter(p => p.statut === 'Retard').length;
        const absents = allPointages.filter(p => p.statut === 'Absent').length;
        const total = allPointages.length;
        const rate = total > 0 ? Math.round((presents / total) * 100) : 0;

        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Rapport Officiel de Présence Journalière - ${ecole}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; margin: 30px; line-height: 1.4; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 20px; }
                    .header-left { text-align: left; }
                    .header-right { text-align: right; }
                    .school-title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; color: #0d8b6d; }
                    .school-sub { font-size: 11px; color: #555; text-transform: uppercase; margin-top: 3px; font-weight: bold; }
                    .report-title { text-align: center; margin: 25px 0 15px 0; }
                    .report-title h1 { font-size: 20px; text-transform: uppercase; font-weight: 900; margin: 0; text-decoration: underline; }
                    .report-title p { font-size: 12px; font-weight: bold; color: #333; margin-top: 5px; }
                    
                    .stats-box { display: flex; justify-content: space-around; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center; }
                    .stat-item h4 { margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; }
                    .stat-item p { margin: 2px 0 0 0; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; }

                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                    th { background-color: #0f172a; color: #fff; padding: 10px 8px; text-align: left; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; border: 1px solid #0f172a; }
                    td { padding: 8px; border: 1px solid #cbd5e1; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    
                    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
                    .badge-present { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
                    .badge-retard { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
                    .badge-absent { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

                    .footer { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
                    .signature-box { width: 220px; text-align: center; border-top: 1px solid #000; padding-top: 5px; font-size: 11px; font-weight: bold; }
                    .certif { font-size: 9px; color: #666; text-align: center; margin-top: 30px; font-style: italic; }
                    
                    @media print {
                        body { margin: 15mm 10mm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <h2 class="school-title">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                        <div class="school-sub">MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ</div>
                        <div class="school-sub" style="color: #0d8b6d; font-size: 13px; margin-top: 4px;">${instName}</div>
                    </div>
                    <div class="header-right">
                        <div style="font-size: 11px; font-weight: bold;">SYSTÈME ERP DE SUPER-ADMINISTRATION</div>
                        <div style="font-size: 10px; color: #666;">Date d'édition : ${new Date().toLocaleString('fr-FR')}</div>
                        <div style="font-size: 10px; color: #0d8b6d; font-weight: bold;">Certification Biométrique Validée</div>
                    </div>
                </div>

                <div class="report-title">
                    <h1>RAPPORT OFFICIEL DE PRÉSENCE JOURNALIÈRE</h1>
                    <p>Séance du ${today}</p>
                </div>

                <div class="stats-box">
                    <div class="stat-item">
                        <h4>${total}</h4>
                        <p>Effectif Total</p>
                    </div>
                    <div class="stat-item">
                        <h4 style="color: #15803d;">${presents}</h4>
                        <p>Présents</p>
                    </div>
                    <div class="stat-item">
                        <h4 style="color: #b45309;">${retards}</h4>
                        <p>Retards</p>
                    </div>
                    <div class="stat-item">
                        <h4 style="color: #b91c1c;">${absents}</h4>
                        <p>Absents</p>
                    </div>
                    <div class="stat-item">
                        <h4 style="color: #0d8b6d;">${rate}%</h4>
                        <p>Taux d'Assiduité</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">N°</th>
                            <th style="width: 30%;">Nom & Prénom de l'Agent</th>
                            <th style="width: 20%;">Fonction / Rôle</th>
                            <th style="width: 15%;">Heure d'Arrivée</th>
                            <th style="width: 15%;">Heure de Départ</th>
                            <th style="width: 15%;">Statut Validé</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allPointages.map((p, idx) => `
                            <tr>
                                <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                                <td style="font-weight: bold;">${p.nom}</td>
                                <td>${p.role || 'Personnel'}</td>
                                <td style="font-family: monospace; font-weight: bold;">${p.arrivee || '—'}</td>
                                <td style="font-family: monospace;">${p.depart || (p.statut === 'Terminé' ? '16:30' : 'En poste')}</td>
                                <td>
                                    <span class="badge ${p.statut === 'Absent' ? 'badge-absent' : p.statut === 'Retard' ? 'badge-retard' : 'badge-present'}">
                                        ${p.statut}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="footer">
                    <div class="signature-box">
                        Le Superviseur RH / Direction
                    </div>
                    <div class="signature-box">
                        Le Chef d'Établissement (Sceau & Signature)
                    </div>
                </div>

                <div class="certif">
                    Document généré automatiquement par le module de Reconnaissance Faciale IA • Plateforme Harmonie & Retrouvailles
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    window.exportPresenceCSV = function(ecole) {
        const allPointages = db.rh.pointages.filter(p => p.ecole === ecole || ecole === 'Tous');
        const headers = ["ID", "Nom_Prenom", "Role", "Ecole", "Arrivee", "Depart", "Statut", "Methode"];
        const rows = allPointages.map(p => [
            p.id,
            `"${p.nom}"`,
            `"${p.role || 'Personnel'}"`,
            `"${p.ecole || db.ecoleActive}"`,
            p.arrivee || '—',
            p.depart || (p.statut === 'Terminé' ? '16:30' : 'En poste'),
            p.statut,
            "Reconnaissance_Faciale_IA"
        ]);
        
        let csvContent = "\uFEFF" + headers.join(";") + "\n" + rows.map(r => r.join(";")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Rapport_Presence_${ecole}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    window.filterPresenceByStatus = function(statut) {
        document.querySelectorAll('.presence-filter-btn').forEach(b => {
            b.classList.remove('active', 'bg-emerald-500', 'text-gray-950');
            b.classList.add('bg-white/5', 'text-gray-300');
        });
        if (event && event.target) {
            event.target.classList.add('active', 'bg-emerald-500', 'text-gray-950');
            event.target.classList.remove('bg-white/5', 'text-gray-300');
        }
        document.querySelectorAll('.presence-row').forEach(row => {
            if (statut === 'all' || row.dataset.statut === statut) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };

    window.filterPresenceTable = function(search) {
        const query = search.toLowerCase();
        document.querySelectorAll('.presence-row').forEach(row => {
            const name = row.dataset.name || '';
            row.style.display = name.includes(query) ? '' : 'none';
        });
    };

    window.printIndividualPresence = function(nom, role, arrivee, statut) {
        alert(`Fiche de présence individuelle générée pour ${nom} (${role}) — Heure: ${arrivee} — Statut: ${statut}`);
    };

});
