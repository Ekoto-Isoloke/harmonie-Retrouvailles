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

    // SECURITY CHECK 2: Strict RBAC - Super-Admin & Direction Générale ont accès au panneau global
    const isSuperAdmin = user.role === 'Super-Admin' || user.role === 'Direction Générale';

    if (!isSuperAdmin) {
        // Directeur / Préfet / DP / DE / DD / Sur École attempt
        if (['Directeur (D.P)', 'D.P', 'Directeur', 'Préfet', 'D.E', 'D.D', 'Sur École', 'Direction'].includes(user.role)) {
            alert(`⛔ ACCÈS RESTREINT — HIÉRARCHIE EPST\n\nCe panneau de contrôle global est réservé exclusivement au Super-Administrateur Général.\n\nVous êtes réorienté vers votre Espace de Direction Pédagogique.`);
            window.location.href = '/prefet-dashboard.html';
            return;
        }
        // Enseignant attempt
        if (user.role === 'Enseignant' || user.role === 'Professeur' || user.role === 'Instituteur') {
            alert(`⛔ ACCÈS REFUSÉ — SÉCURITÉ EPST\n\nUn enseignant (${user.prenom} ${user.nom}) ne peut pas accéder au système d'administration.\n\nVous êtes réorienté vers votre Espace Enseignant.`);
            window.location.href = '/teacher-dashboard.html';
            return;
        }
        // Comptable attempt
        if (user.role === 'Comptable') {
            alert(`⛔ ACCÈS REFUSÉ — SÉCURITÉ EPST\n\nVotre rôle ne vous autorise qu'à l'Espace Comptabilité.\n\nVous êtes réorienté vers votre Espace Comptabilité.`);
            window.location.href = '/compta-dashboard.html';
            return;
        }
        // Parent attempt
        if (user.role === 'Parent') {
            alert(`⛔ ACCÈS REFUSÉ — SÉCURITÉ EPST\n\nUn compte parent ne peut jamais accéder au système d'administration de l'école.\n\nVous êtes réorienté vers votre Espace Parent.`);
            window.location.href = '/parent-dashboard.html';
            return;
        }

        // Fallback for any unknown role
        alert(`⛔ ACCÈS REFUSÉ — Vous n'avez pas l'autorisation d'accéder à ce panneau.`);
        window.location.href = '/login.html';
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
    // Update avatar with real initials — pas de ui-avatars (fausse image)
    const avatarEl = document.querySelector('img[alt="User"]');
    if (avatarEl) {
        const initials = `${(user.prenom||'A')[0]}${(user.nom||'D')[0]}`.toUpperCase();
        // Remplacer l'<img> par un <div> textuel avec initiales (comme teacher/prefet dashboard)
        const avatarDiv = document.createElement('div');
        avatarDiv.className = avatarEl.className + ' flex items-center justify-center font-black text-sm bg-amber-700/60 text-amber-200 border border-amber-500/40';
        avatarDiv.textContent = initials;
        avatarEl.replaceWith(avatarDiv);
    }
    // Show role badge
    const roleBadge = document.querySelector('p.text-xs.text-gold-600');
    if (roleBadge && user.role) roleBadge.textContent = user.role;

    // ==========================================
    // ADAPTATION SIDEBAR DIRECTION GÉNÉRALE
    // ==========================================
    if (user.role === 'Direction Générale') {
        const navTitle = document.querySelector('#sidebar-nav p');
        if (navTitle) navTitle.innerHTML = '<span class="text-amber-400 font-bold">🏛️ Direction Générale</span>';

        const dashboardNav = document.querySelector('a[data-target="dashboard"] span');
        if (dashboardNav) dashboardNav.textContent = 'Cockpit Exécutif';

        const financeNav = document.querySelector('a[data-target="finance"] span');
        if (financeNav) financeNav.textContent = 'Rapport Journalier';

        // Suppression pure et simple des modules non désirés pour la Direction Générale
        const modulesToRemove = ['gestion-comptes', 'communication', 'dossier360', 'coffrefort', 'classe-virtuelle'];
        modulesToRemove.forEach(target => {
            const el = document.querySelector(`a[data-target="${target}"]`);
            if (el) el.remove();
        });
    }

    let currentView = 'dashboard';

    const renderView = () => {
        if (!ui.content) return;
        switch (currentView) {
            case 'dashboard': renderDashboard(); break;
            case 'presence-journaliere': renderPresenceJournaliere(); break;
            case 'pedagogie': renderPedagogie(); break;
            case 'rh': renderRH(); break;
            case 'finance': renderFinance(); break;
            case 'communication': renderCommunication(); break;
            case 'coffrefort': renderCoffreFort(); break;
            case 'suivi-direction': renderSuiviDirection(); break;
            case 'dossier360': renderDossier360(); break;
            case 'gestion-comptes': renderGestionComptes(); break;
            case 'classe-virtuelle': renderClasseVirtuelle(); break;
        }
        if (window.lucide) lucide.createIcons();
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
                btnH.className = db.ecoleActive === 'Harmonie' ? "active-inst" : "inactive-inst";
                btnR.className = db.ecoleActive === 'Retrouvailles' ? "active-inst" : "inactive-inst";
            }
        };
        if (btnH) btnH.onclick = () => { db.ecoleActive = 'Harmonie'; saveDb(); updateHeader(); renderView(); };
        if (btnR) btnR.onclick = () => { db.ecoleActive = 'Retrouvailles'; saveDb(); updateHeader(); renderView(); };
        updateHeader();
    }

    // ==========================================
    // RENDER: DIRECTION GÉNÉRALE COCKPIT
    // ==========================================
    function renderDirectionGeneraleCockpit() {
        const harmonie  = db.institutions['Harmonie'];
        const retro     = db.institutions['Retrouvailles'];
        const allPtH    = db.rh.pointages.filter(p => p.ecole === 'Harmonie');
        const allPtR    = db.rh.pointages.filter(p => p.ecole === 'Retrouvailles');
        const pctH      = allPtH.length > 0 ? Math.round((allPtH.filter(p => p.statut === 'Présent').length / allPtH.length) * 100) : 0;
        const pctR      = allPtR.length > 0 ? Math.round((allPtR.filter(p => p.statut === 'Présent').length / allPtR.length) * 100) : 0;
        const soldeH    = harmonie.finance.revenus  - harmonie.finance.depenses;
        const soldeR    = retro.finance.revenus     - retro.finance.depenses;
        const totalRev  = harmonie.finance.revenus  + retro.finance.revenus;
        const totalDep  = harmonie.finance.depenses + retro.finance.depenses;
        const totalSold = soldeH + soldeR;
        const totalElev = harmonie.pedagogie.eleves.length + retro.pedagogie.eleves.length;
        const today     = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <i data-lucide="landmark" class="w-5 h-5 text-gray-950"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-white uppercase tracking-tight">Cockpit Direction Générale</h2>
                            <p class="text-[11px] text-amber-300/80 uppercase tracking-widest font-bold">Supervision Exécutive — Promoteur & Famille</p>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 uppercase tracking-widest">${today}</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span class="text-xs font-black text-amber-400 uppercase tracking-widest">Vue Consolidée — 2 Établissements</span>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col gap-2">
                    <div class="flex items-center gap-2"><i data-lucide="trending-up" class="w-5 h-5 text-emerald-400"></i><span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Recettes Totales</span></div>
                    <h3 class="text-2xl font-black text-white">$${totalRev.toLocaleString()}</h3>
                    <span class="text-[10px] text-gray-400">Harmonie + Retrouvailles</span>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col gap-2">
                    <div class="flex items-center gap-2"><i data-lucide="trending-down" class="w-5 h-5 text-rose-400"></i><span class="text-[10px] font-black text-rose-400 uppercase tracking-widest">Dépenses Totales</span></div>
                    <h3 class="text-2xl font-black text-white">$${totalDep.toLocaleString()}</h3>
                    <span class="text-[10px] text-gray-400">Consolidé groupe</span>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col gap-2">
                    <div class="flex items-center gap-2"><i data-lucide="wallet" class="w-5 h-5 text-amber-400"></i><span class="text-[10px] font-black text-amber-400 uppercase tracking-widest">Solde Net Groupe</span></div>
                    <h3 class="text-2xl font-black ${totalSold >= 0 ? 'text-emerald-400' : 'text-rose-400'}">$${totalSold.toLocaleString()}</h3>
                    <span class="text-[10px] text-gray-400">${totalSold >= 0 ? 'Excédent' : 'Déficit'} budgétaire</span>
                </div>
                <div class="glass-panel p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex flex-col gap-2">
                    <div class="flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-blue-400"></i><span class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Élèves</span></div>
                    <h3 class="text-2xl font-black text-white">${totalElev}</h3>
                    <span class="text-[10px] text-gray-400">Inscrits dans le groupe</span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div class="glass-panel rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent overflow-hidden">
                    <div class="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">🏫</div>
                        <div><h3 class="font-black text-white text-base">C.S. Harmonie</h3><p class="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Primaire & Maternelle</p></div>
                        <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span class="text-[10px] font-black text-emerald-300 uppercase">En ligne</span>
                        </div>
                    </div>
                    <div class="p-6 grid grid-cols-3 gap-4">
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recettes</p><p class="text-lg font-black text-emerald-400">$${harmonie.finance.revenus.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dépenses</p><p class="text-lg font-black text-rose-400">$${harmonie.finance.depenses.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde</p><p class="text-lg font-black ${soldeH >= 0 ? 'text-amber-400' : 'text-rose-400'}">$${soldeH.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Présence</p><p class="text-lg font-black text-cyan-400">${pctH}%</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Élèves</p><p class="text-lg font-black text-blue-400">${harmonie.pedagogie.eleves.length}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes</p><p class="text-lg font-black text-purple-400">${harmonie.pedagogie.classes.length}</p></div>
                    </div>
                    <div class="px-6 pb-5 flex gap-2">
                        <a href="/prefet-dashboard.html?view=harmonie" class="flex-1 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-xl text-center transition">🔍 Superviser</a>
                        <a href="/compta-dashboard.html" class="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-xl text-center transition">📊 Rapport Journalier</a>
                    </div>
                </div>
                <div class="glass-panel rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-500/5 to-transparent overflow-hidden">
                    <div class="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">🎓</div>
                        <div><h3 class="font-black text-white text-base">G.S. Retrouvailles</h3><p class="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Humanités & Secondaire</p></div>
                        <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-lg">
                            <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                            <span class="text-[10px] font-black text-purple-300 uppercase">En ligne</span>
                        </div>
                    </div>
                    <div class="p-6 grid grid-cols-3 gap-4">
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recettes</p><p class="text-lg font-black text-emerald-400">$${retro.finance.revenus.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dépenses</p><p class="text-lg font-black text-rose-400">$${retro.finance.depenses.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde</p><p class="text-lg font-black ${soldeR >= 0 ? 'text-amber-400' : 'text-rose-400'}">$${soldeR.toLocaleString()}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Présence</p><p class="text-lg font-black text-cyan-400">${pctR}%</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Élèves</p><p class="text-lg font-black text-blue-400">${retro.pedagogie.eleves.length}</p></div>
                        <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes</p><p class="text-lg font-black text-purple-400">${retro.pedagogie.classes.length}</p></div>
                    </div>
                    <div class="px-6 pb-5 flex gap-2">
                        <a href="/prefet-dashboard.html?view=retrouvailles" class="flex-1 py-2.5 bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider rounded-xl text-center transition">🔍 Superviser</a>
                        <a href="/compta-dashboard.html" class="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-xl text-center transition">📊 Rapport Journalier</a>
                    </div>
                </div>
            </div>

            <div class="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent mb-6">
                <h3 class="font-black text-sm uppercase tracking-widest text-amber-300 mb-4 flex items-center gap-2">
                    <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i> Accès Rapide — Immersion Directe
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <a href="/prefet-dashboard.html?view=harmonie" class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 rounded-2xl transition group">
                        <span class="text-2xl">🏫</span><span class="text-[10px] font-black text-gray-300 group-hover:text-emerald-300 uppercase tracking-wider text-center">Direction Harmonie</span>
                    </a>
                    <a href="/prefet-dashboard.html?view=retrouvailles" class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 rounded-2xl transition group">
                        <span class="text-2xl">🎓</span><span class="text-[10px] font-black text-gray-300 group-hover:text-purple-300 uppercase tracking-wider text-center">Direction Retrouvailles</span>
                    </a>
                    <a href="/compta-dashboard.html" class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/40 rounded-2xl transition group">
                        <span class="text-2xl">💰</span><span class="text-[10px] font-black text-gray-300 group-hover:text-yellow-300 uppercase tracking-wider text-center">Rapport Journalier</span>
                    </a>
                    <a href="/teacher-dashboard.html" class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/40 rounded-2xl transition group">
                        <span class="text-2xl">👨‍🏫</span><span class="text-[10px] font-black text-gray-300 group-hover:text-blue-300 uppercase tracking-wider text-center">Corps Enseignant</span>
                    </a>
                    <a href="/pointage.html" class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 rounded-2xl transition group">
                        <span class="text-2xl">⏱️</span><span class="text-[10px] font-black text-gray-300 group-hover:text-cyan-300 uppercase tracking-wider text-center">Borne Biométrique</span>
                    </a>
                </div>
            </div>

            <div class="glass-panel p-6 rounded-3xl border border-white/10">
                <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2">
                    <i data-lucide="activity" class="w-4 h-4 text-blue-400"></i> Journal d'Activités Groupe
                </h3>
                <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
                    ${[...db.rh.journalDirection].sort((a,b) => b.date > a.date ? 1 : -1).slice(0, 8).map(j => `
                        <div class="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                            <div class="w-7 h-7 rounded-full ${j.ecole === 'Retrouvailles' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'} flex items-center justify-center text-[10px] font-black shrink-0">${j.ecole === 'Retrouvailles' ? '🎓' : '🏫'}</div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between gap-2">
                                    <p class="text-xs font-bold text-white truncate">${j.action}</p>
                                    <span class="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${j.ecole === 'Retrouvailles' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}">${j.ecole}</span>
                                </div>
                                <p class="text-[10px] text-gray-400 mt-0.5">${j.detail}</p>
                                <p class="text-[9px] text-gray-500 mt-0.5 font-mono">${j.heure} — ${j.date}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    // ==========================================
    // RENDER: DASHBOARD
    // ==========================================
    function renderDashboard() {
        // Cockpit exécutif dédié pour Direction Générale
        if (user.role === 'Direction Générale') {
            renderDirectionGeneraleCockpit();
            return;
        }
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

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-start">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tight">Tableau de Bord ERP</h2>
                    <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">${db.ecoleActive} — ${today}</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-xs font-black text-emerald-400 uppercase tracking-widest">Système Opérationnel</span>
                </div>
            </div>

            <!-- KPI Grid -->
            <div id="widgets" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                ${createKPI('Recettes Totales', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-emerald-500', 'bg-emerald-500/10')}
                ${createKPI('Dépenses', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-400', 'bg-red-500/10')}
                ${createKPI('Solde Net', `$${solde.toLocaleString()}`, 'wallet', 'text-amber-400', 'bg-amber-500/10')}
                ${createKPI('Effectif Inscrits', inst.pedagogie.eleves.length, 'users', 'text-blue-400', 'bg-blue-500/10')}
            </div>

            <!-- Secondary KPIs with Highlighted Late Metric -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center"><i data-lucide="user-check" class="w-6 h-6 text-cyan-400"></i></div>
                    <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taux Présence</p><h4 class="text-2xl font-black text-white">${presenceRate}%</h4></div>
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
                    <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes Actives</p><h4 class="text-2xl font-black text-white">${inst.pedagogie.classes.length}</h4></div>
                </div>
            </div>

            <!-- Charts + Activity Feed -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="lg:col-span-2 glass-panel p-6 rounded-3xl shadow-xl border border-white/10">
                    <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4">Évolution Financière ${new Date().getFullYear()}</h3>
                    <div id="chartRev" class="h-64"></div>
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

            <!-- EPST-Specific: Classes Scolarité Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        // Redirection vers le module Rapport Journalier Officiel
        renderRapportJournalierOfficiel();
    }

    // Helper: Base de données des Rapports Journaliers
    function getDailyReportsDb() {
        if (!localStorage.getItem('hr_daily_reports')) {
            const defaultReports = [
                {
                    id: 'REP-HAR-20260904-01',
                    date: '2026-09-04',
                    ecole: 'Harmonie',
                    auteur: { nom: 'KASOMBO', prenom: 'PAUL', role: 'Directeur (D.P)', email: 'kasombo@retrouvailles.cd' },
                    status: 'approved',
                    submittedAt: '2026-09-04T12:30:00.000Z',
                    approvedBy: { nom: 'EKOTO ISOLOKE', prenom: 'CHADA', role: 'Super-Admin', approvedAt: '2026-09-04T13:15:00.000Z', visaNumber: 'VISA-SA-HAR-0904' },
                    activiteJournaliere: "Journée d'enseignement régulière dans toutes les classes primaires et maternelles. Déroulement du contrôle mensuel de calcul rapide en 4ème et 5ème primaire. Réunion de coordination pédagogique tenue à 12h45.",
                    aiExecutiveSummary: "Journée académique sereine au C.S. Harmonie avec 96% de présence élèves et 100% de cours assurés. Deux visites institutionnelles enregistrées et aucun incident disciplinaire.",
                    effectifEleves: { totalInscrits: 310, presents: 298, absents: 12, tauxAssiduite: 96.1 },
                    personnelEnseignants: { totalEnseignants: 14, presents: 14, absents: 0, retards: 1, detailsRetards: "Inst. KASONGO Jean (07h36 - +6min)" },
                    visiteurs: [
                        { heure: "09h10", nom: "Mme TSHILOMBO Marie", qualite: "Inspectrice Itinérante EPST", but: "Contrôle des dossiers d'inscription 6ème", suite: "Dossiers conformes, visa accordé" },
                        { heure: "11h00", nom: "M. KABEYA Patrick", qualite: "Parent d'élève (5ème Prim.)", but: "Demande de suivi pédagogique", suite: "Reçu en audience par le D.P" }
                    ],
                    disciplineClimat: { incidents: "Aucun incident majeur. Climat serein.", infirmerie: "1 élève soigné pour céphalée légère.", conduiteGenerale: "Excellente discipline d'ensemble" },
                    directivesDirecteur: "Veiller à l'affichage des résultats d'évaluations avant samedi midi.",
                    directivesPromoteur: "Très bon travail de suivi. Maintenir la rigueur sur l'assiduité des maîtres de 6ème. — Le Promoteur"
                },
                {
                    id: 'REP-RET-20260904-01',
                    date: '2026-09-04',
                    ecole: 'Retrouvailles',
                    auteur: { nom: 'MATUNGULU', prenom: 'ALAIN', role: 'Préfet', email: 'matungulu@retrouvailles.cd' },
                    status: 'approved',
                    submittedAt: '2026-09-04T12:45:00.000Z',
                    approvedBy: { nom: 'EKOTO ISOLOKE', prenom: 'CHADA', role: 'Super-Admin', approvedAt: '2026-09-04T13:20:00.000Z', visaNumber: 'VISA-SA-RET-0904' },
                    activiteJournaliere: "Évaluations mi-trimestrielles en Sciences Commerciales et Bio-Chimie. Passage de l'équipe technique de la Sous-Division pour vérification des listes TENASOSP. Les cours de l'après-midi se sont déroulés normalement.",
                    aiExecutiveSummary: "G.S. Retrouvailles : Tenue des évaluations mi-trimestrielles en toute conformité. 2 retards d'enseignants notés et régularisés. Visite de la Sous-Division satisfaisante.",
                    effectifEleves: { totalInscrits: 420, presents: 402, absents: 18, tauxAssiduite: 95.7 },
                    personnelEnseignants: { totalEnseignants: 22, presents: 21, absents: 1, retards: 2, detailsRetards: "Prof. ILUNGA Jacques (07h42), Prof. MBUYI Alain (07h38)" },
                    visiteurs: [
                        { heure: "10h15", nom: "Inspecteur Principal LUKUSA", qualite: "Sous-Division Kinshasa Est", but: "Vérification des registres TENASOSP", suite: "Procès-verbal de conformité signé" }
                    ],
                    disciplineClimat: { incidents: "1 cas de bavardage répété en 4ème Bio-Chimie (avertissement verbal).", infirmerie: "2 élèves reçus pour fatigue passagère.", conduiteGenerale: "Bonne tenue générale" },
                    directivesDirecteur: "Clôture impérative de l'encodage des cotes du 1er trimestre ce vendredi soir.",
                    directivesPromoteur: ""
                }
            ];
            localStorage.setItem('hr_daily_reports', JSON.stringify(defaultReports));
        }
        return JSON.parse(localStorage.getItem('hr_daily_reports')) || [];
    }

    window.selectedEcoleRapport = localStorage.getItem('hr_selected_ecole_rapport') || 'Harmonie';

    window.switchEcoleRapport = function(ecole) {
        window.selectedEcoleRapport = ecole;
        localStorage.setItem('hr_selected_ecole_rapport', ecole);
        renderRapportJournalierOfficiel();
    };

    window.approuverRapportParSuperAdmin = function(reportId) {
        const reports = getDailyReportsDb();
        const rep = reports.find(r => r.id === reportId);
        if (!rep) return;

        const visaNo = `VISA-SA-${rep.ecole.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        rep.status = 'approved';
        rep.approvedBy = {
            nom: (user && user.nom) || 'EKOTO ISOLOKE',
            prenom: (user && user.prenom) || 'CHADA',
            role: 'Super-Admin',
            approvedAt: new Date().toISOString(),
            visaNumber: visaNo
        };

        localStorage.setItem('hr_daily_reports', JSON.stringify(reports));
        alert(`✅ Rapport #${reportId} visé et approuvé avec succès !

Numéro de Visa Officiel : ${visaNo}
Le rapport est désormais immédiatement visible par la Direction Générale.`);
        renderRapportJournalierOfficiel();
    };

    window.demanderRevisionRapport = function(reportId) {
        const motif = prompt("Précisez le motif de révision pour le Directeur / Préfet :");
        if (!motif) return;

        const reports = getDailyReportsDb();
        const rep = reports.find(r => r.id === reportId);
        if (!rep) return;

        rep.status = 'needs_revision';
        rep.revisionMotif = motif;
        localStorage.setItem('hr_daily_reports', JSON.stringify(reports));

        alert(`🔄 Demande de correction transmise au ${rep.auteur.role} de ${rep.ecole}.`);
        renderRapportJournalierOfficiel();
    };

    window.savePromoteurDirective = function(reportId) {
        const input = document.getElementById(`directive-promoteur-${reportId}`);
        if (!input) return;
        const text = input.value.trim();

        const reports = getDailyReportsDb();
        const rep = reports.find(r => r.id === reportId);
        if (!rep) return;

        rep.directivesPromoteur = text;
        localStorage.setItem('hr_daily_reports', JSON.stringify(reports));

        alert("💾 Directive de la Direction Générale enregistrée et scellée dans le rapport officiel !");
        renderRapportJournalierOfficiel();
    };

    function renderRapportJournalierOfficiel() {
        const reports = getDailyReportsDb();
        const selectedEco = window.selectedEcoleRapport || 'Harmonie';
        const isSuperAdminRole = user && user.role === 'Super-Admin';

        // Rapports en attente pour le Super-Admin
        const pendingReports = reports.filter(r => r.status === 'submitted');
        
        // Rapports approuvés pour l'école sélectionnée
        const approvedForSchool = reports.filter(r => r.ecole === selectedEco && r.status === 'approved')
                                         .sort((a,b) => b.date.localeCompare(a.date));
        const latestApproved = approvedForSchool[0];

        ui.content.innerHTML = `
            <!-- En-tête Prestigieux -->
            <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div class="flex items-center gap-3 mb-1.5">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-gray-950 shadow-lg shadow-amber-500/20 font-black text-xl">
                            🏛️
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-white uppercase tracking-tight">Rapport Journalier de Direction</h2>
                            <p class="text-xs text-amber-300 font-bold uppercase tracking-widest">Gouvernance Institutionnelle • Zéro Donnée Financière</p>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400">Circuit hiérarchique : Établissement ➔ Visa Super-Administrateur ➔ Prise d'Acte Direction Générale</p>
                </div>

                <!-- Sélecteur d'établissement prestigieux -->
                <div class="p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                    <button type="button" onclick="switchEcoleRapport('Harmonie')"
                        class="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${selectedEco === 'Harmonie' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/50' : 'text-gray-400 hover:text-white'}">
                        <span>🏫</span>
                        <span>C.S. Harmonie (Primaire)</span>
                    </button>
                    <button type="button" onclick="switchEcoleRapport('Retrouvailles')"
                        class="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${selectedEco === 'Retrouvailles' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/50' : 'text-gray-400 hover:text-white'}">
                        <span>🎓</span>
                        <span>G.S. Retrouvailles (Secondaire)</span>
                    </button>
                </div>
            </div>

            <!-- SECTION SPÉCIALE SUPER-ADMIN : RAPPORTS EN ATTENTE DE VISA -->
            ${isSuperAdminRole && pendingReports.length > 0 ? `
                <div class="glass-panel p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent mb-8 shadow-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2.5">
                            <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                            <h3 class="text-sm font-black text-amber-300 uppercase tracking-wider">
                                📥 Rapports Journaliers en Attente de Votre Visa d'Approbation (${pendingReports.length})
                            </h3>
                        </div>
                        <span class="text-xs text-gray-400">Le Promoteur ne verra ces rapports qu'après votre approbation</span>
                    </div>

                    <div class="space-y-4">
                        ${pendingReports.map(rep => `
                            <div class="p-5 rounded-2xl bg-black/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${rep.ecole === 'Harmonie' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'}">${rep.ecole}</span>
                                        <strong class="text-white text-xs">Rapport du ${rep.date}</strong>
                                        <span class="text-gray-400 text-xs">• Par : ${rep.auteur.prenom} ${rep.auteur.nom} (${rep.auteur.role})</span>
                                    </div>
                                    <p class="text-xs text-gray-300">${rep.activiteJournaliere}</p>
                                    <div class="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 mt-1 font-medium">
                                        <span>👥 Élèves : <strong>${rep.effectifEleves.presents}/${rep.effectifEleves.totalInscrits}</strong> (${rep.effectifEleves.tauxAssiduite}%)</span>
                                        <span>👨‍🏫 Enseignants : <strong>${rep.personnelEnseignants.presents}/${rep.personnelEnseignants.totalEnseignants}</strong></span>
                                        <span>⏱️ Retards : <strong class="text-amber-400">${rep.personnelEnseignants.retards}</strong></span>
                                        <span>🏛️ Visiteurs : <strong>${rep.visiteurs?.length || 0}</strong></span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                    <button type="button" onclick="approuverRapportParSuperAdmin('${rep.id}')"
                                        class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer">
                                        <i data-lucide="check-check" class="w-4 h-4"></i> Viser & Approuver pour le DG
                                    </button>
                                    <button type="button" onclick="demanderRevisionRapport('${rep.id}')"
                                        class="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold rounded-xl transition cursor-pointer">
                                        🔄 Demander Correction
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- AFFICHAGE DU RAPPORT DU JOUR APPROUVÉ POUR L'ÉTABLISSEMENT SÉLECTIONNÉ -->
            ${latestApproved ? `
                <div class="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 relative overflow-hidden">
                    <div class="absolute -right-20 -top-20 w-60 h-60 ${selectedEco === 'Harmonie' ? 'bg-emerald-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl pointer-events-none"></div>

                    <!-- Bandeau Officiel de Visa Super-Admin -->
                    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl">
                                ✓
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black uppercase text-emerald-400 tracking-wider">
                                        Rapport Certifié & Approuvé par le Super-Administrateur
                                    </span>
                                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-500/30">
                                        ${latestApproved.approvedBy?.visaNumber || 'VISA-OFFICIEL'}
                                    </span>
                                </div>
                                <p class="text-[11px] text-gray-300 mt-0.5">
                                    Visé par <strong>${latestApproved.approvedBy?.prenom} ${latestApproved.approvedBy?.nom}</strong> le ${latestApproved.approvedBy ? new Date(latestApproved.approvedBy.approvedAt).toLocaleDateString('fr-FR') : ''} • Émis par le <strong>${latestApproved.auteur.role}</strong>
                                </p>
                            </div>
                        </div>
                        <button type="button" onclick="printReportDocumentAdmin('${latestApproved.id}')"
                            class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shrink-0">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimer la Fiche A4
                        </button>
                    </div>

                    <!-- KPIs Assiduité & Présences (SANS AUCUNE FINANCE) -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assiduité Élèves</p>
                            <h4 class="text-2xl font-black text-white mt-1">${latestApproved.effectifEleves.tauxAssiduite}%</h4>
                            <p class="text-[10px] text-emerald-400 mt-0.5">${latestApproved.effectifEleves.presents} présents / ${latestApproved.effectifEleves.totalInscrits} inscrits</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enseignants Présents</p>
                            <h4 class="text-2xl font-black text-emerald-400 mt-1">${latestApproved.personnelEnseignants.presents} / ${latestApproved.personnelEnseignants.totalEnseignants}</h4>
                            <p class="text-[10px] text-gray-400 mt-0.5">${latestApproved.personnelEnseignants.absents} absent(s)</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <p class="text-[10px] font-black text-amber-400 uppercase tracking-widest">Retards Constatés</p>
                            <h4 class="text-2xl font-black text-amber-400 mt-1">${latestApproved.personnelEnseignants.retards}</h4>
                            <p class="text-[10px] text-amber-300 mt-0.5 truncate" title="${latestApproved.personnelEnseignants.detailsRetards}">${latestApproved.personnelEnseignants.detailsRetards || 'Aucun'}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Visiteurs Reçus</p>
                            <h4 class="text-2xl font-black text-white mt-1">${latestApproved.visiteurs?.length || 0}</h4>
                            <p class="text-[10px] text-gray-400 mt-0.5">Personnalités & parents</p>
                        </div>
                    </div>

                    <!-- Synthèse Exécutive IA -->
                    <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/20 mb-6">
                        <div class="flex items-center gap-2 mb-1.5">
                            <i data-lucide="sparkles" class="w-4 h-4 text-purple-400"></i>
                            <h4 class="text-xs font-black uppercase text-purple-300 tracking-wider">Synthèse Exécutive IA pour la Direction Générale</h4>
                        </div>
                        <p class="text-xs text-gray-200 leading-relaxed font-medium">${latestApproved.aiExecutiveSummary}</p>
                    </div>

                    <!-- Activités de la Journée -->
                    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-2">
                        <h4 class="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                            <i data-lucide="file-text" class="w-4 h-4"></i> Activités & Déroulement de la Journée
                        </h4>
                        <p class="text-xs text-gray-200 leading-relaxed whitespace-pre-line">${latestApproved.activiteJournaliere}</p>
                    </div>

                    <!-- Registre des Visiteurs Extérieurs -->
                    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-3">
                        <h4 class="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                            <i data-lucide="users" class="w-4 h-4"></i> Registre des Personnalités & Visiteurs du Jour
                        </h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="text-[10px] uppercase text-gray-400 border-b border-white/10">
                                        <th class="py-2">Heure</th>
                                        <th class="py-2">Nom & Prénom</th>
                                        <th class="py-2">Qualité</th>
                                        <th class="py-2">Objet de la Visite</th>
                                        <th class="py-2">Décision / Suite Donnée</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5 text-gray-300">
                                    ${(latestApproved.visiteurs && latestApproved.visiteurs.length > 0) ? latestApproved.visiteurs.map(v => `
                                        <tr>
                                            <td class="py-2.5 font-mono text-amber-300">${v.heure}</td>
                                            <td class="py-2.5 font-bold text-white">${v.nom}</td>
                                            <td class="py-2.5 text-gray-400">${v.qualite}</td>
                                            <td class="py-2.5">${v.but}</td>
                                            <td class="py-2.5 text-emerald-400 font-medium">${v.suite}</td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="5" class="py-3 text-center text-gray-400 italic">Aucun visiteur répertorié pour cette date.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Discipline & Infirmerie -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <h5 class="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                                <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> Discipline & Climat Scolaire
                            </h5>
                            <p class="text-xs text-gray-300 mt-1">${latestApproved.disciplineClimat?.incidents || 'Rien à signaler.'}</p>
                        </div>
                        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <h5 class="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5">
                                <i data-lucide="heart-pulse" class="w-3.5 h-3.5"></i> Santé & Infirmerie
                            </h5>
                            <p class="text-xs text-gray-300 mt-1">${latestApproved.disciplineClimat?.infirmerie || 'Rien à signaler.'}</p>
                        </div>
                    </div>

                    <!-- Directives du Directeur / Préfet -->
                    <div class="p-5 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-1">
                        <h5 class="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                            📢 Directives de la Direction Locale
                        </h5>
                        <p class="text-xs text-gray-300 mt-1 italic">${latestApproved.directivesDirecteur || 'Application stricte des consignes en vigueur.'}</p>
                    </div>

                    <!-- ZONE EXÉCUTIVE : DIRECTIVE DE LA DIRECTION GÉNÉRALE (PROMOTEUR) -->
                    <div class="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-2 border-amber-500/40">
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-2">
                                <span>👑</span>
                                <span>Directive & Prise d'Acte de la Direction Générale (Promoteur)</span>
                            </label>
                            <span class="text-[10px] text-amber-400/80 uppercase tracking-widest font-bold">Visible par la Direction de l'École</span>
                        </div>
                        <textarea id="directive-promoteur-${latestApproved.id}" rows="2" placeholder="Inscrivez ici vos remarques, instructions ou félicitations pour le Préfet ou le D.P..."
                            class="w-full p-3 bg-black/40 border border-amber-500/30 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed">${latestApproved.directivesPromoteur || ''}</textarea>
                        <div class="flex justify-end mt-2">
                            <button type="button" onclick="savePromoteurDirective('${latestApproved.id}')"
                                class="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer">
                                💾 Enregistrer ma Directive
                            </button>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3 mb-8">
                    <div class="w-16 h-16 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto text-2xl">📋</div>
                    <h3 class="text-lg font-bold text-white">Aucun rapport validé pour ${selectedEco === 'Harmonie' ? 'C.S. Harmonie' : 'G.S. Retrouvailles'}</h3>
                    <p class="text-xs text-gray-400 max-w-md mx-auto">
                        Le rapport journalier pour cet établissement est en cours de préparation par la Direction ou en attente du visa officiel du Super-Administrateur.
                    </p>
                </div>
            `}

            <!-- ARCHIVES DES RAPPORTS DE L'ÉCOLE -->
            <div class="glass-panel p-6 rounded-3xl border border-white/10">
                <h3 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2">
                    <i data-lucide="archive" class="w-4 h-4 text-purple-400"></i>
                    Archives des Rapports Journaliers — ${selectedEco === 'Harmonie' ? 'C.S. Harmonie' : 'G.S. Retrouvailles'}
                </h3>
                <div class="space-y-3">
                    ${approvedForSchool.map(r => `
                        <div class="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 hover:bg-white/10 transition">
                            <div class="space-y-0.5">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black text-white font-mono">#${r.id}</span>
                                    <span class="text-xs text-gray-400">• Date : ${r.date}</span>
                                    <span class="text-[10px] text-emerald-400 font-bold">Visa : ${r.approvedBy?.visaNumber}</span>
                                </div>
                                <p class="text-xs text-gray-300 line-clamp-1">${r.activiteJournaliere}</p>
                            </div>
                            <button type="button" onclick="printReportDocumentAdmin('${r.id}')"
                                class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer">
                                <i data-lucide="printer" class="w-3.5 h-3.5"></i> Imprimer A4
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();
    }

    window.printReportDocumentAdmin = function(reportId) {
        const reports = getDailyReportsDb();
        const rep = reports.find(r => r.id === reportId);
        if (!rep) return;

        const printWin = window.open('', '_blank', 'width=850,height=1100');
        printWin.document.write(`
          <html>
          <head>
            <title>Rapport Journalier - ${rep.ecole} - ${rep.date}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 30px; color: #111; font-size: 13px; line-height: 1.4; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
              .header h1 { margin: 0; font-size: 16px; text-transform: uppercase; }
              .header h2 { margin: 2px 0; font-size: 14px; text-transform: uppercase; font-weight: normal; }
              .header h3 { margin: 4px 0 0 0; font-size: 13px; font-weight: bold; text-decoration: underline; }
              .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; background: #f0f0f0; padding: 4px 8px; margin: 12px 0 6px 0; border-left: 4px solid #333; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px; }
              th, td { border: 1px solid #444; padding: 5px 8px; text-align: left; }
              th { background: #f4f4f4; }
              .signatures { display: flex; justify-content: space-between; margin-top: 40px; page-break-inside: avoid; }
              .sign-box { text-align: center; width: 45%; border-top: 1px solid #222; padding-top: 6px; }
              .stamp { border: 2px solid #15803d; color: #15803d; padding: 4px 8px; display: inline-block; font-weight: bold; text-transform: uppercase; font-size: 11px; margin-top: 6px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
              <h2>MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ</h2>
              <h2>${rep.ecole === 'Harmonie' ? 'COMPLEXE SCOLAIRE HARMONIE (MATERNELLE & PRIMAIRE)' : 'GROUPE SCOLAIRE RETROUVAILLES (SECONDAIRE & HUMANITÉS)'}</h2>
              <h3>RAPPORT JOURNALIER OFFICIEL DE LA DIRECTION</h3>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:12px;">
              <div><strong>Rapport N° :</strong> ${rep.id}</div>
              <div><strong>Date :</strong> ${rep.date}</div>
              <div><strong>Établissement :</strong> ${rep.ecole}</div>
            </div>

            <div class="section-title">I. ASSIDUITÉ DES ÉLÈVES</div>
            <table>
              <tr>
                <th>Effectif Total Inscrits</th>
                <th>Élèves Présents</th>
                <th>Élèves Absents</th>
                <th>Taux de Fréquentation</th>
              </tr>
              <tr>
                <td>${rep.effectifEleves.totalInscrits}</td>
                <td>${rep.effectifEleves.presents}</td>
                <td>${rep.effectifEleves.absents}</td>
                <td>${rep.effectifEleves.tauxAssiduite}%</td>
              </tr>
            </table>

            <div class="section-title">II. PRÉSENCE DU PERSONNEL ENSEIGNANT</div>
            <table>
              <tr>
                <th>Enseignants Prévus</th>
                <th>Présents</th>
                <th>Absents</th>
                <th>Retards</th>
                <th>Détail des Retards</th>
              </tr>
              <tr>
                <td>${rep.personnelEnseignants.totalEnseignants}</td>
                <td>${rep.personnelEnseignants.presents}</td>
                <td>${rep.personnelEnseignants.absents}</td>
                <td>${rep.personnelEnseignants.retards}</td>
                <td>${rep.personnelEnseignants.detailsRetards || 'Néant'}</td>
              </tr>
            </table>

            <div class="section-title">III. ACTIVITÉS PÉDAGOGIQUES & DÉROULEMENT DU JOUR</div>
            <p style="margin:4px 0 10px 0; text-align:justify;">${rep.activiteJournaliere}</p>

            <div class="section-title">IV. REGISTRE DES VISITEURS EXTÉRIEURS</div>
            <table>
              <tr>
                <th style="width:60px;">Heure</th>
                <th>Nom du Visiteur</th>
                <th>Qualité</th>
                <th>Objet de la Visite</th>
                <th>Suite Donnée</th>
              </tr>
              ${(rep.visiteurs && rep.visiteurs.length > 0) ? rep.visiteurs.map(v => `
                <tr>
                  <td>${v.heure}</td>
                  <td>${v.nom}</td>
                  <td>${v.qualite}</td>
                  <td>${v.but}</td>
                  <td>${v.suite}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align:center; font-style:italic;">Aucun visiteur extérieur enregistré ce jour</td></tr>'}
            </table>

            <div class="section-title">V. DISCIPLINE & SANTÉ</div>
            <p><strong>Incidents / Sanctions :</strong> ${rep.disciplineClimat?.incidents || 'R.A.S'}</p>
            <p><strong>Infirmerie / Soins :</strong> ${rep.disciplineClimat?.infirmerie || 'R.A.S'}</p>

            <div class="section-title">VI. DIRECTIVES DE LA DIRECTION</div>
            <p>${rep.directivesDirecteur || 'Application stricte du programme scolaire en cours.'}</p>

            ${rep.directivesPromoteur ? `
              <div class="section-title">VII. PRISE D'ACTE & DIRECTIVES DU PROMOTEUR (DIRECTION GÉNÉRALE)</div>
              <p style="font-style:italic; font-weight:bold; color:#854d0e;">${rep.directivesPromoteur}</p>
            ` : ''}

            <div class="signatures">
              <div class="sign-box">
                Pour la Direction de l'Établissement<br>
                <strong>${rep.auteur.prenom} ${rep.auteur.nom}</strong><br>
                <em>${rep.auteur.role}</em>
              </div>
              <div class="sign-box">
                Pour le Super-Administrateur Général<br>
                ${rep.approvedBy ? `
                  <strong>${rep.approvedBy.prenom} ${rep.approvedBy.nom}</strong><br>
                  <span class="stamp">VISÉ & APPROUVÉ (${rep.approvedBy.visaNumber})</span>
                ` : '<em>En attente de visa</em>'}
              </div>
            </div>
          </body>
          </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); }, 500);
    };


    // ==========================================
    // HELPERS
    // ==========================================
    function initDashboardCharts() {
        if (!window.ApexCharts) return;
        const inst = db.institutions[db.ecoleActive], isD = document.documentElement.classList.contains('dark');
        new ApexCharts(document.getElementById('chartRev'), {
            series: [{ name: 'Recettes', data: [15, 30, 25, 55, 40, inst.finance.revenus / 1000] }],
            chart: { type: 'area', height: 320, toolbar: { show: false } }, colors: ['#22c55e'], theme: { mode: isD ? 'dark' : 'light' }
        }).render();
        new ApexCharts(document.getElementById('chartPed'), {
            series: [45, 30, 25],
            chart: { type: 'donut', height: 320 }, labels: ['Maternelle', 'Primaire', 'Reste'], theme: { mode: isD ? 'dark' : 'light' }
        }).render();
    }

    function createKPI(t, v, i, c, b) {
        return `<div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:translate-y-[-3px] transition-all cursor-move border border-white/10">
            <div class="w-12 h-12 rounded-xl ${b} ${c} flex items-center justify-center shrink-0"><i data-lucide="${i}" class="w-6 h-6"></i></div>
            <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">${t}</p><h4 class="text-2xl font-black dark:text-white">${v}</h4></div>
        </div>`;
    }

    function renderPedagogie() {
        const inst = db.institutions[db.ecoleActive];
        const isRetro = db.ecoleActive === 'Retrouvailles';

        // Define action listeners
        window.approuverInscription = function (id) {
            inst.pedagogie.nouvellesInscriptions = inst.pedagogie.nouvellesInscriptions.filter(i => i.id !== id);
            saveDb();
            renderPedagogie();
        };

        // Sample bulletin data for demonstration
        const sampleBulletin = {
            eleve: 'MUKENDI KABUYA David',
            classe: isRetro ? '3ème Humanités (Scientifique)' : '4ème Primaire',
            trimestre: '2ème Trimestre',
            matieres: isRetro ? [
                { cours: 'Mathématiques', max: 50, pts: 42, appreciation: 'Bien' },
                { cours: 'Physique-Chimie', max: 50, pts: 38, appreciation: 'Assez Bien' },
                { cours: 'Biologie', max: 30, pts: 26, appreciation: 'Bien' },
                { cours: 'Français', max: 50, pts: 45, appreciation: 'Très Bien' },
                { cours: 'Histoire-Géo', max: 30, pts: 22, appreciation: 'Assez Bien' },
                { cours: 'Anglais', max: 30, pts: 24, appreciation: 'Bien' },
                { cours: 'ECM', max: 20, pts: 18, appreciation: 'Excellent' },
                { cours: 'Informatique', max: 20, pts: 19, appreciation: 'Excellent' },
                { cours: 'Sport & EPS', max: 20, pts: 17, appreciation: 'Bien' }
            ] : [
                { cours: 'Calcul/Arithmétique', max: 50, pts: 40, appreciation: 'Bien' },
                { cours: 'Langue Française', max: 50, pts: 43, appreciation: 'Très Bien' },
                { cours: 'Éveil Scientifique', max: 30, pts: 26, appreciation: 'Bien' },
                { cours: 'Histoire-Géo', max: 20, pts: 17, appreciation: 'Bien' },
                { cours: 'EPS', max: 20, pts: 18, appreciation: 'Très Bien' },
                { cours: 'Morale/Religion', max: 30, pts: 26, appreciation: 'Excellent' }
            ]
        };
        const totalPts = sampleBulletin.matieres.reduce((s, m) => s + m.pts, 0);
        const totalMax = sampleBulletin.matieres.reduce((s, m) => s + m.max, 0);
        const pct = Math.round((totalPts / totalMax) * 100);

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Pédagogie & Palmarès EPST</h2>
                    <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">${db.ecoleActive} — Gestion académique EPST Kinshasa</p>
                </div>
                <button onclick="document.getElementById('modal-bulletin').classList.remove('hidden')" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm">
                    <i data-lucide="file-text" class="w-4 h-4"></i> Aperçu Bulletin
                </button>
            </div>

            <!-- Modal Bulletin -->
            <div id="modal-bulletin" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div class="p-6 bg-blue-900 text-white text-center">
                        <div class="text-lg font-black uppercase">${db.ecoleActive === 'Retrouvailles' ? 'Groupe Scolaire Retrouvailles' : 'Complexe Scolaire Harmonie'}</div>
                        <div class="text-sm mt-1">Bulletin Scolaire Officiel — ${sampleBulletin.trimestre} — Année 2025-2026</div>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div><strong>Élève :</strong> ${sampleBulletin.eleve}</div>
                            <div><strong>Classe :</strong> ${sampleBulletin.classe}</div>
                        </div>
                        <table class="w-full text-sm border border-gray-200 rounded-xl overflow-hidden mb-4">
                            <thead class="bg-gray-100 text-xs font-black uppercase text-gray-600">
                                <tr>
                                    <th class="p-2 text-left">Cours</th>
                                    <th class="p-2 text-center">/ Max</th>
                                    <th class="p-2 text-center">Points</th>
                                    <th class="p-2 text-center">%</th>
                                    <th class="p-2 text-left">Appréciation</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${sampleBulletin.matieres.map(m => `
                                <tr>
                                    <td class="p-2 font-semibold">${m.cours}</td>
                                    <td class="p-2 text-center text-gray-500">${m.max}</td>
                                    <td class="p-2 text-center font-black ${m.pts/m.max >= 0.7 ? 'text-green-600' : m.pts/m.max >= 0.5 ? 'text-amber-600' : 'text-red-600'}">${m.pts}</td>
                                    <td class="p-2 text-center">${Math.round(m.pts/m.max*100)}%</td>
                                    <td class="p-2 text-xs">${m.appreciation}</td>
                                </tr>`).join('')}
                            </tbody>
                            <tfoot class="bg-blue-50 font-black">
                                <tr>
                                    <td class="p-2">TOTAL GÉNÉRAL</td>
                                    <td class="p-2 text-center">${totalMax}</td>
                                    <td class="p-2 text-center text-blue-700">${totalPts}</td>
                                    <td class="p-2 text-center text-blue-700">${pct}%</td>
                                    <td class="p-2 text-xs">${pct >= 70 ? '✅ Admis(e)' : pct >= 50 ? '⚠️ Passable' : '❌ Insuffisant'}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div class="flex justify-end gap-3">
                            <button onclick="document.getElementById('modal-bulletin').classList.add('hidden')" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50">Fermer</button>
                            <button onclick="window.print()" class="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-600 flex items-center gap-2"><i data-lucide="printer" class="w-4 h-4"></i> Imprimer</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <!-- Nouvelles Inscriptions (Probation) -->
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-black text-xl uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="user-plus" class="text-brand-500 w-6 h-6"></i> Demandes en probation
                        </h3>
                        <span class="bg-red-100 text-red-600 text-xs font-black px-3 py-1 rounded-full">${inst.pedagogie.nouvellesInscriptions.length} Nouveaux</span>
                    </div>
                    
                    ${inst.pedagogie.nouvellesInscriptions.length === 0 ?
                '<p class="text-center text-sm text-gray-500 italic py-10">Aucune demande en probation.</p>' :
                `<div class="space-y-4">
                            ${inst.pedagogie.nouvellesInscriptions.map(insc => `
                                <div class="bg-[#112240]/50 dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 flex justify-between items-center transition-all hover:shadow-md">
                                    <div>
                                        <div class="font-bold text-gray-900 dark:text-white text-lg">${insc.nom}</div>
                                        <div class="text-xs text-gray-400 mt-1 uppercase font-semibold">
                                            Demandé pour: ${insc.classe} ${insc.option ? `| ${insc.option}` : ''}
                                        </div>
                                        <div class="text-[10px] text-gray-400 mt-1">Ref: ${insc.id} • Fait le ${insc.date}</div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="approuverInscription('${insc.id}')" class="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors" title="Approuver et Intégrer">
                                            <i data-lucide="check" class="w-5 h-5"></i>
                                        </button>
                                        <button onclick="approuverInscription('${insc.id}')" class="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors" title="Rejeter">
                                            <i data-lucide="x" class="w-5 h-5"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        <div class="mt-8 bg-[#112240]/50/80 dark:bg-gray-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-gray-100 dark:border-gray-700 shadow-inner no-print">
                            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-4 sm:mb-0 uppercase tracking-wider">
                                <i data-lucide="info" class="w-4 h-4 text-brand-500"></i>
                                Exporter la liste d'attente
                            </div>
                            <div class="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
                                <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-[#112240]/80 dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="window.print()">
                                    <i data-lucide="printer" class="w-4 h-4 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-white"></i> 
                                    Imprimer
                                </button>
                                <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="alert('Génération du PDF...')">
                                    <i data-lucide="file-text" class="w-4 h-4 text-white/80 group-hover:text-white"></i> 
                                    Format PDF
                                </button>
                                <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="alert('Export Excel...')">
                                    <i data-lucide="sheet" class="w-4 h-4 text-white/80 group-hover:text-white"></i> 
                                    Format Excel
                                </button>
                            </div>
                        </div>`
            }
                </div>

                <!-- Palmarès / Performances -->
                <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-black text-xl uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="award" class="text-gold-500 w-6 h-6"></i> Palmarès Général
                        </h3>
                        <button class="text-xs bg-gold-100 text-gold-700 font-bold px-4 py-2 rounded-lg hover:bg-gold-200 transition">Générer Bulletin</button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="p-4 bg-[#112240]/80 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span class="font-bold uppercase text-sm">Effectif Total</span>
                            <span class="font-black text-xl text-brand-600">${inst.pedagogie.eleves.length}</span>
                        </div>
                        <div class="p-4 bg-[#112240]/80 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span class="font-bold uppercase text-sm">Classes Actives</span>
                            <span class="font-black text-xl text-blue-600">${inst.pedagogie.classes.length}</span>
                        </div>
                        ${db.ecoleActive === 'Retrouvailles' ? `
                        <div class="p-4 bg-[#112240]/80 dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span class="font-bold uppercase text-sm">Sections & Options</span>
                            <span class="font-black text-xl text-purple-600">${inst.pedagogie.sections.length}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                <h3 class="font-black text-xl uppercase tracking-wider mb-6">Liste des Inscrits</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left mb-6">
                        <thead class="text-xs text-gray-400 uppercase font-black border-b dark:border-gray-700">
                            <tr><th class="pb-4">Nom de l'élève</th><th class="pb-4">Classe</th><th class="pb-4 text-right no-print">Action</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${inst.pedagogie.eleves.map(e => `
                                <tr>
                                    <td class="py-4 font-bold">${e.nom}</td>
                                    <td class="py-4 text-sm">${e.classe} ${e.option ? `(${e.option})` : ''}</td>
                                    <td class="py-4 text-right no-print">
                                        <button class="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase px-3 py-1 bg-blue-50 rounded-lg">Dossier</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Export actions for the Registered list -->
                <div class="mt-8 bg-[#112240]/50/80 dark:bg-gray-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-gray-100 dark:border-gray-700 shadow-inner no-print">
                    <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-4 sm:mb-0 uppercase tracking-wider">
                        <i data-lucide="users" class="w-4 h-4 text-blue-500"></i>
                        Générer un registre officiel
                    </div>
                    <div class="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
                        <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3 bg-[#112240]/80 dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md font-black rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="window.print()">
                            <i data-lucide="printer" class="w-4 h-4 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-white"></i> 
                            Archivage Impression
                        </button>
                        <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 shadow-xl shadow-gray-900/20 font-black rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="alert('Préparation du document PDF Officiel...')">
                            <i data-lucide="file-down" class="w-4 h-4 text-brand-300 dark:text-brand-600"></i> 
                            Télécharger PDF Sécurisé
                        </button>
                    </div>
                </div>
            </div>
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
            ['comptes','pointages','classes','hierarchie'].forEach(t => {
                document.getElementById('rh-panel-' + t).classList.toggle('hidden', t !== tab);
                const btn = document.getElementById('rh-tab-' + t);
                if (btn) {
                    btn.className = t === tab
                        ? 'px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-[#112240]/80 dark:bg-gray-700 shadow-md text-brand-600'
                        : 'px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';
                }
            });
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
            printWindow.document.write('<h2>Registre de Présence du ' + today + '</h2>');
            printWindow.document.write(printContent);
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
    // ==========================================
    // VUE: GESTION DES COMPTES (SUPER-ADMIN SUPRÊME)
    // ==========================================
    function renderGestionComptes() {
        let db = JSON.parse(localStorage.getItem('hr_users_db_v2')) || [];
        
        // Assurer la présence permanente du Super-Admin s'il n'existe pas encore
        if (!db.some(u => u.email && (u.email.toLowerCase() === 'chadrackisoloke@gmail.com' || u.email.toLowerCase() === 'admin@retrouvailes.cd'))) {
            db.unshift({
                id: 99,
                email: 'chadrackisoloke@gmail.com',
                password: 'chada123',
                role: 'Super-Admin',
                nom: 'EKOTO ISOLOKE',
                prenom: 'CHADA',
                ecole: 'Harmonie-Retrouvailles',
                phone: '+243827613009',
                faceDescriptor: null
            });
            localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
        }

        // Filtres actuels
        window._userFilterRole = window._userFilterRole || 'Tous';
        window._userFilterEcole = window._userFilterEcole || 'Tous';
        window._userSearchQuery = window._userSearchQuery || '';

        // Appliquer les filtres
        let filteredUsers = db.filter(u => {
            const matchRole = window._userFilterRole === 'Tous' || u.role === window._userFilterRole;
            const matchEcole = window._userFilterEcole === 'Tous' || (u.ecole && u.ecole.includes(window._userFilterEcole)) || u.ecole === 'Harmonie-Retrouvailles';
            const query = window._userSearchQuery.toLowerCase();
            const matchQuery = !query || 
                (u.nom && u.nom.toLowerCase().includes(query)) ||
                (u.prenom && u.prenom.toLowerCase().includes(query)) ||
                (u.email && u.email.toLowerCase().includes(query)) ||
                (u.role && u.role.toLowerCase().includes(query));
            return matchRole && matchEcole && matchQuery;
        });

        // Métriques
        const totalUsers = db.length;
        const totalEnseignants = db.filter(u => u.role === 'Enseignant' || u.role === 'Professeur' || u.role === 'Instituteur').length;
        const totalBioEnrolled = db.filter(u => u.faceDescriptor && Array.isArray(u.faceDescriptor) && u.faceDescriptor.length === 128).length;
        const totalDirection = db.filter(u => ['Super-Admin', 'Direction', 'Préfet', 'Directeur (D.P)', 'D.P', 'D.E'].includes(u.role)).length;

        // Action: Modal d'édition d'utilisateur
        window.openEditUserModal = function(id) {
            const u = db.find(x => x.id == id);
            if (!u) return;

            const modalHtml = `
                <div id="user-edit-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
                    <div class="glass-panel border border-white/15 bg-[#0a192f]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white">
                        <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                                    <i data-lucide="user-cog" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 class="font-black text-lg text-white">Modifier le Compte</h3>
                                    <p class="text-xs text-gray-400 font-mono">${u.email}</p>
                                </div>
                            </div>
                            <button onclick="document.getElementById('user-edit-modal').remove()" class="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <form id="form-edit-user" onsubmit="event.preventDefault(); window.saveEditedUser(${u.id});" class="space-y-4 text-left">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prénom</label>
                                    <input type="text" id="edit-prenom" value="${u.prenom || ''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none" required />
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nom</label>
                                    <input type="text" id="edit-nom" value="${u.nom || ''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none" required />
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email / Identifiant</label>
                                <input type="email" id="edit-email" value="${u.email || ''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none" required />
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rôle</label>
                                    <select id="edit-role" class="w-full bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none">
                                        <option value="Super-Admin" ${u.role === 'Super-Admin' ? 'selected' : ''}>Super-Admin</option>
                                        <option value="Direction Générale" ${u.role === 'Direction Générale' ? 'selected' : ''}>Direction Générale</option>
                                        <option value="Directeur (D.P)" ${u.role === 'Directeur (D.P)' ? 'selected' : ''}>Directeur (D.P) - Harmonie</option>
                                        <option value="Préfet" ${u.role === 'Préfet' ? 'selected' : ''}>Préfet - Retrouvailles</option>
                                        <option value="Enseignant" ${u.role === 'Enseignant' ? 'selected' : ''}>Enseignant / Professeur</option>
                                        <option value="Comptable" ${u.role === 'Comptable' ? 'selected' : ''}>Comptable</option>
                                        <option value="Parent" ${u.role === 'Parent' ? 'selected' : ''}>Parent</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Institution</label>
                                    <select id="edit-ecole" class="w-full bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none">
                                        <option value="Harmonie" ${u.ecole === 'Harmonie' ? 'selected' : ''}>C.S. Harmonie</option>
                                        <option value="Retrouvailles" ${u.ecole === 'Retrouvailles' ? 'selected' : ''}>G.S. Retrouvailles</option>
                                        <option value="Harmonie-Retrouvailles" ${u.ecole === 'Harmonie-Retrouvailles' ? 'selected' : ''}>Toutes (Direction)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe</label>
                                <div class="relative">
                                    <input type="text" id="edit-password" value="${u.password || ''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-400 focus:outline-none" required />
                                </div>
                            </div>

                            <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                                <button type="button" onclick="document.getElementById('user-edit-modal').remove()" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition">
                                    Annuler
                                </button>
                                <button type="submit" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition">
                                    Enregistrer les Modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) lucide.createIcons();
        };

        // Action: Sauvegarder les modifications
        window.saveEditedUser = function(id) {
            const u = db.find(x => x.id == id);
            if (!u) return;
            u.prenom = document.getElementById('edit-prenom').value.trim();
            u.nom = document.getElementById('edit-nom').value.trim();
            u.email = document.getElementById('edit-email').value.trim();
            u.role = document.getElementById('edit-role').value;
            u.ecole = document.getElementById('edit-ecole').value;
            u.password = document.getElementById('edit-password').value.trim();

            localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
            document.getElementById('user-edit-modal')?.remove();
            showNotification('Compte mis à jour avec succès', 'success');
            renderGestionComptes();
        };

        // Action: Réinitialiser l'empreinte faciale
        window.resetUserBiometrics = function(id) {
            const u = db.find(x => x.id == id);
            if (!u) return;
            if (confirm(`Voulez-vous réinitialiser l'empreinte faciale de ${u.prenom} ${u.nom} ? L'utilisateur devra ré-enregistrer son visage lors de sa prochaine connexion.`)) {
                u.faceDescriptor = null;
                u.biometric = false;
                localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
                showNotification(`Empreinte réinitialisée pour ${u.prenom} ${u.nom}.`, 'info');
                renderGestionComptes();
            }
        };

        // Action: Supprimer un compte
        window.deleteUserAccount = function(id) {
            const u = db.find(x => x.id == id);
            if (!u) return;
            if (u.email.toLowerCase() === 'chadrackisoloke@gmail.com' || u.email.toLowerCase() === 'admin@retrouvailes.cd') {
                alert("⛔ Action interdite : Vous ne pouvez pas supprimer le compte Super-Administrateur principal.");
                return;
            }
            if (confirm(`⚠️ Confirmation de suppression : Êtes-vous sûr de vouloir supprimer définitivement le compte de ${u.prenom} ${u.nom} (${u.email}) ?`)) {
                db = db.filter(x => x.id != id);
                localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
                showNotification(`Compte de ${u.prenom} ${u.nom} supprimé avec succès.`, 'success');
                renderGestionComptes();
            }
        };

        // Action: Nettoyer tous les comptes fictifs / tests
        window.cleanupDummyAccounts = function() {
            if (confirm("🧹 NETTOYAGE COMPLET : Voulez-vous supprimer tous les comptes de test/fictifs pour laisser uniquement le Super-Admin et préparer le système aux vraies données des enseignants ?")) {
                const superAdmin = db.find(u => u.email.toLowerCase() === 'chadrackisoloke@gmail.com' || u.role === 'Super-Admin') || {
                    id: 99,
                    email: 'chadrackisoloke@gmail.com',
                    password: 'chada123',
                    role: 'Super-Admin',
                    nom: 'EKOTO ISOLOKE',
                    prenom: 'CHADA',
                    ecole: 'Harmonie-Retrouvailles',
                    phone: '+243827613009'
                };
                
                // Conserver uniquement le Super-Admin
                db = [superAdmin];
                localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
                localStorage.setItem('hr_cloud_accounts', JSON.stringify(db));
                showNotification("Base nettoyée avec succès ! Seul votre compte Super-Admin a été conservé.", "success");
                renderGestionComptes();
            }
        };

        // Action: Modal création nouvel utilisateur manuel
        window.openCreateUserModal = function() {
            const modalHtml = `
                <div id="user-create-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
                    <div class="glass-panel border border-white/15 bg-[#0a192f]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white">
                        <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 class="font-black text-lg text-white">Créer un Nouveau Compte</h3>
                                    <p class="text-xs text-gray-400">Ajout d'un membre du personnel par le Super-Admin</p>
                                </div>
                            </div>
                            <button onclick="document.getElementById('user-create-modal').remove()" class="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <form id="form-create-user" onsubmit="event.preventDefault(); window.saveCreatedUser();" class="space-y-4 text-left">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prénom *</label>
                                    <input type="text" id="new-prenom" placeholder="Ex: Jacques" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none" required />
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nom *</label>
                                    <input type="text" id="new-nom" placeholder="Ex: ILUNGA" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none" required />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email *</label>
                                    <input type="email" id="new-email" placeholder="nom@retrouvailles.cd" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none" required />
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Téléphone</label>
                                    <input type="text" id="new-phone" placeholder="+243..." class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rôle *</label>
                                    <select id="new-role" class="w-full bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none">
                                        <option value="Enseignant" selected>Enseignant / Professeur</option>
                                        <option value="Direction Générale">Direction Générale</option>
                                        <option value="Directeur (D.P)">Directeur (D.P) - Primaire</option>
                                        <option value="Préfet">Préfet - Humanités</option>
                                        <option value="Comptable">Comptable</option>
                                        <option value="Parent">Parent</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Établissement *</label>
                                    <select id="new-ecole" class="w-full bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none">
                                        <option value="Harmonie">C.S. Harmonie</option>
                                        <option value="Retrouvailles" selected>G.S. Retrouvailles</option>
                                        <option value="Harmonie-Retrouvailles">Toutes</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe provisoire *</label>
                                <input type="text" id="new-password" value="pass2026" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-400 focus:outline-none" required />
                            </div>

                            <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                                <button type="button" onclick="document.getElementById('user-create-modal').remove()" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition">
                                    Annuler
                                </button>
                                <button type="submit" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition">
                                    Créer le Compte
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) lucide.createIcons();
        };

        // Sauvegarder nouvel utilisateur
        window.saveCreatedUser = function() {
            const email = document.getElementById('new-email').value.trim();
            if (db.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
                alert("Cet email est déjà attribué à un autre compte.");
                return;
            }
            const newUser = {
                id: Date.now(),
                prenom: document.getElementById('new-prenom').value.trim(),
                nom: document.getElementById('new-nom').value.trim(),
                email: email,
                phone: document.getElementById('new-phone').value.trim(),
                role: document.getElementById('new-role').value,
                ecole: document.getElementById('new-ecole').value,
                password: document.getElementById('new-password').value.trim(),
                faceDescriptor: null,
                biometric: false
            };
            db.push(newUser);
            localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
            document.getElementById('user-create-modal')?.remove();
            showNotification(`Compte créé pour ${newUser.prenom} ${newUser.nom} (${newUser.role})`, 'success');
            renderGestionComptes();
        };

        // Table Rows HTML
        let rows = '';
        if (filteredUsers.length === 0) {
            rows = `
                <tr>
                    <td colspan="6" class="py-12 text-center text-gray-500">
                        <i data-lucide="users-round" class="w-10 h-10 mx-auto mb-2 opacity-30"></i>
                        <p class="font-bold text-sm">Aucun compte trouvé avec ces critères</p>
                    </td>
                </tr>
            `;
        } else {
            filteredUsers.forEach(u => {
                const isSuper = u.role === 'Super-Admin' || u.email.toLowerCase() === 'chadrackisoloke@gmail.com';
                const hasFace = u.faceDescriptor && Array.isArray(u.faceDescriptor) && u.faceDescriptor.length === 128;
                
                // Badges
                let roleBadge = 'bg-gray-500/20 text-gray-300 border-gray-500/30';
                if (isSuper) roleBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-black';
                else if (u.role.includes('Préfet') || u.role.includes('Directeur')) roleBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold';
                else if (u.role === 'Enseignant') roleBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
                else if (u.role === 'Comptable') roleBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';

                const bioBadge = hasFace 
                    ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><i data-lucide="scan-face" class="w-3.5 h-3.5"></i> Empreinte Active</span>'
                    : '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-500/10 text-gray-400 border border-white/5"><i data-lucide="shield-alert" class="w-3.5 h-3.5 opacity-60"></i> Non Enrôlé</span>';

                const initials = ((u.prenom || '?')[0] + (u.nom || '?')[0]).toUpperCase();

                rows += `
                    <tr class="border-b border-white/5 hover:bg-white/[0.03] transition-all">
                        <td class="py-4 px-4">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl ${isSuper ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black font-black' : 'bg-white/10 text-white font-bold'} flex items-center justify-center text-xs shadow">
                                    ${initials}
                                </div>
                                <div>
                                    <p class="font-bold text-sm text-white flex items-center gap-2">
                                        ${u.prenom || ''} ${u.nom || ''}
                                        ${isSuper ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">👑 Fondateur</span>' : ''}
                                    </p>
                                    <p class="text-xs text-gray-400 font-mono">${u.phone || 'Pas de tél'}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-4 text-xs font-mono text-gray-300">${u.email}</td>
                        <td class="py-4 px-4">
                            <span class="inline-block px-2.5 py-1 rounded-lg text-xs border ${roleBadge}">${u.role}</span>
                        </td>
                        <td class="py-4 px-4 text-xs font-medium text-gray-300">
                            <span class="px-2 py-0.5 rounded bg-white/5 border border-white/5">${u.ecole || 'Harmonie'}</span>
                        </td>
                        <td class="py-4 px-4">${bioBadge}</td>
                        <td class="py-4 px-4 text-xs font-mono text-gray-400">
                            <span class="px-2 py-1 rounded bg-black/40 border border-white/5 select-all">${u.password || '••••••'}</span>
                        </td>
                        <td class="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button onclick="openEditUserModal(${u.id})" title="Modifier le compte" class="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition text-xs font-bold inline-flex items-center gap-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                Modifier
                            </button>
                            ${hasFace ? `
                                <button onclick="resetUserBiometrics(${u.id})" title="Réinitialiser l'empreinte faciale" class="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition text-xs font-bold inline-flex items-center gap-1">
                                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                                    Reset Face
                                </button>
                            ` : ''}
                            ${!isSuper ? `
                                <button onclick="deleteUserAccount(${u.id})" title="Supprimer définitivement" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition text-xs font-bold inline-flex items-center gap-1">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    Supprimer
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
            });
        }

        ui.content.innerHTML = `
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 fade-in">
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <i data-lucide="user-cog" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-white uppercase tracking-tight">Gestion des Comptes</h2>
                            <p class="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Autorité Suprême d'Administration • Contrôle d'Accès & Empreintes</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2.5">
                    <button onclick="cleanupDummyAccounts()" class="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-red-500/10">
                        <i data-lucide="trash" class="w-4 h-4 text-red-400"></i>
                        Purger Comptes Fictifs
                    </button>
                    <button onclick="openCreateUserModal()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-emerald-500/20">
                        <i data-lucide="user-plus" class="w-4 h-4"></i>
                        Nouveau Compte
                    </button>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-in" style="animation-delay: 0.05s">
                <div class="glass-panel p-4 rounded-2xl border border-white/5 bg-[#112240]/40">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Comptes</p>
                    <p class="text-2xl font-black text-white mt-1">${totalUsers}</p>
                </div>
                <div class="glass-panel p-4 rounded-2xl border border-white/5 bg-[#112240]/40">
                    <p class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Empreintes Actives</p>
                    <p class="text-2xl font-black text-emerald-400 mt-1">${totalBioEnrolled}</p>
                </div>
                <div class="glass-panel p-4 rounded-2xl border border-white/5 bg-[#112240]/40">
                    <p class="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Enseignants</p>
                    <p class="text-2xl font-black text-blue-400 mt-1">${totalEnseignants}</p>
                </div>
                <div class="glass-panel p-4 rounded-2xl border border-white/5 bg-[#112240]/40">
                    <p class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Cadres Direction</p>
                    <p class="text-2xl font-black text-amber-400 mt-1">${totalDirection}</p>
                </div>
            </div>

            <!-- Filter & Search Bar -->
            <div class="glass-panel rounded-2xl p-4 mb-6 border border-white/10 bg-[#0a192f]/60 flex flex-col md:flex-row items-center justify-between gap-4 fade-in" style="animation-delay: 0.1s">
                <div class="relative w-full md:w-80">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-3 text-gray-400"></i>
                    <input type="text" id="filter-user-search" placeholder="Rechercher par nom, email, rôle..." value="${window._userSearchQuery}" oninput="window._userSearchQuery = this.value; renderGestionComptes();" class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none" />
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <select onchange="window._userFilterRole = this.value; renderGestionComptes();" class="bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none">
                        <option value="Tous" ${window._userFilterRole === 'Tous' ? 'selected' : ''}>Tous les Rôles</option>
                        <option value="Super-Admin" ${window._userFilterRole === 'Super-Admin' ? 'selected' : ''}>Super-Admin</option>
                        <option value="Préfet" ${window._userFilterRole === 'Préfet' ? 'selected' : ''}>Préfet</option>
                        <option value="Direction Générale" ${window._userFilterRole === 'Direction Générale' ? 'selected' : ''}>Direction Générale</option>
                        <option value="Directeur (D.P)" ${window._userFilterRole === 'Directeur (D.P)' ? 'selected' : ''}>Directeur (D.P)</option>
                        <option value="Enseignant" ${window._userFilterRole === 'Enseignant' ? 'selected' : ''}>Enseignants</option>
                        <option value="Comptable" ${window._userFilterRole === 'Comptable' ? 'selected' : ''}>Comptables</option>
                        <option value="Parent" ${window._userFilterRole === 'Parent' ? 'selected' : ''}>Parents</option>
                    </select>
                    <select onchange="window._userFilterEcole = this.value; renderGestionComptes();" class="bg-[#0d1e36] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none">
                        <option value="Tous" ${window._userFilterEcole === 'Tous' ? 'selected' : ''}>Toutes les Écoles</option>
                        <option value="Harmonie" ${window._userFilterEcole === 'Harmonie' ? 'selected' : ''}>C.S. Harmonie</option>
                        <option value="Retrouvailles" ${window._userFilterEcole === 'Retrouvailles' ? 'selected' : ''}>G.S. Retrouvailles</option>
                    </select>
                </div>
            </div>

            <!-- Main Table Panel -->
            <div class="glass-panel rounded-2xl border border-white/10 bg-[#0a192f]/70 overflow-hidden shadow-xl fade-in" style="animation-delay: 0.15s">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th class="py-3.5 px-4">Utilisateur / Contact</th>
                                <th class="py-3.5 px-4">Email / Login</th>
                                <th class="py-3.5 px-4">Rôle</th>
                                <th class="py-3.5 px-4">Établissement</th>
                                <th class="py-3.5 px-4">Statut Biométrique</th>
                                <th class="py-3.5 px-4">Mot de passe</th>
                                <th class="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5 text-sm">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // EXTRACTION DYNAMIQUE DES POINTAGES LIVE KIOSK (hr_pointages)
    // ==========================================
    function getLivePointages(ecoleActive) {
        const todayIso = new Date().toISOString().split('T')[0];
        const activeUsers = JSON.parse(localStorage.getItem('hr_users_db_v2') || '[]');
        const rawPointages = JSON.parse(localStorage.getItem('hr_pointages') || '[]');

        const todayPointages = rawPointages.filter(p => {
            const pDate = p.date ? p.date.split('T')[0] : (p.arrivee ? todayIso : '');
            return pDate === todayIso;
        });

        function checkLate(timeStr) {
            if (!timeStr || timeStr === '--:--' || timeStr === '—') return false;
            const parts = timeStr.split(':');
            const h = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
            return (h > 7) || (h === 7 && m > 30);
        }

        const list = [];
        activeUsers.forEach(u => {
            if (u.role === 'Super-Admin') return;
            if (ecoleActive !== 'Tous' && u.ecole !== ecoleActive) return;
            const fullName = (u.prenom + ' ' + u.nom).toLowerCase();
            const pt = todayPointages.find(p =>
                (p.nom && p.nom.toLowerCase() === fullName) ||
                (p.email && p.email.toLowerCase() === (u.email || '').toLowerCase())
            );
            if (pt) {
                const arrTime = pt.arrivee && pt.arrivee !== '--:--' ? pt.arrivee : null;
                list.push({
                    id: u.id,
                    nom: u.prenom + ' ' + u.nom,
                    role: u.role,
                    ecole: u.ecole || 'Retrouvailles',
                    arrivee: arrTime || '—',
                    depart: pt.depart && pt.depart !== '--:--' ? pt.depart : '—',
                    statut: arrTime ? (checkLate(arrTime) ? 'Retard' : 'Présent') : 'Absent'
                });
            } else {
                list.push({
                    id: u.id,
                    nom: u.prenom + ' ' + u.nom,
                    role: u.role,
                    ecole: u.ecole || 'Retrouvailles',
                    arrivee: '—',
                    depart: '—',
                    statut: 'Absent'
                });
            }
        });
        return list;
    }

    // ==========================================
    // RENDER: RAPPORT DE PRÉSENCE JOURNALIÈRE DÉDIÉ (SUPER-ADMIN)
    // ==========================================
    function renderPresenceJournaliere() {
        const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const allPointages = getLivePointages(db.ecoleActive);
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
                            <p class="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">${db.ecoleActive} — Registre Biométrique • ${today}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
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

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Taux d'Assiduité</span>
                        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">%</div>
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
                    <p class="text-[10px] text-gray-400 mt-2 font-medium">Arrivées validées avant 07h30</p>
                </div>
                <div class="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black text-amber-400 uppercase tracking-widest">Retards</span>
                        <i data-lucide="clock" class="w-5 h-5 text-amber-400"></i>
                    </div>
                    <div class="text-3xl font-black text-amber-400">${retardCount}</div>
                    <p class="text-[10px] text-gray-400 mt-2 font-medium">Arrivées après 07h30</p>
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

            <div class="glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/10 bg-[#0A192F]/80">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 class="font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="list-checks" class="w-5 h-5 text-emerald-400"></i> Registre Détaillé des Pointages
                        </h3>
                        <p class="text-xs text-gray-400 mt-0.5">Données en temps réel depuis la borne biométrique</p>
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
                            ${allPointages.length === 0 ? `
                                <tr><td colspan="8" class="py-12 text-center text-gray-500">
                                    <i data-lucide="scan-face" class="w-8 h-8 mx-auto mb-2 opacity-30"></i>
                                    <p class="font-bold">Aucun pointage enregistré aujourd'hui</p>
                                    <p class="text-xs mt-1">Les agents doivent se pointer via la borne biométrique</p>
                                </td></tr>
                            ` : allPointages.map(p => {
                                const isLate = p.statut === 'Retard';
                                const isAbsent = p.statut === 'Absent';
                                const statusClass = isAbsent ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : (isLate ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30');
                                const roleColorsMap = {
                                    'Directeur (D.P)': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Directeur Général': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                    'Préfet des Études': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                                    'Enseignant': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                                    'Comptable': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                };
                                const roleBadge = roleColorsMap[p.role] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
                                const initials = p.nom.split(' ').map(n=>n[0]||'').join('').slice(0,2).toUpperCase();
                                return `
                                    <tr class="hover:bg-white/5 transition-colors presence-row" data-statut="${p.statut}" data-name="${p.nom.toLowerCase()}">
                                        <td class="py-4 px-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-sm shadow-md">${initials}</div>
                                                <div>
                                                    <p class="font-bold text-white leading-tight">${p.nom}</p>
                                                    <p class="text-xs text-gray-400 font-mono">ID-${String(p.id||0).padStart(4,'0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleBadge}">${p.role||'Agent'}</span></td>
                                        <td class="py-4 px-4 text-xs font-semibold text-gray-300">${p.ecole}</td>
                                        <td class="py-4 px-4 font-mono font-bold ${isAbsent?'text-gray-500':'text-emerald-300'}">${p.arrivee}</td>
                                        <td class="py-4 px-4 font-mono font-bold ${p.depart!=='—'?'text-blue-300':'text-gray-500'}">${p.depart!=='—'?p.depart:'En poste'}</td>
                                        <td class="py-4 px-4">
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 ${isAbsent?'text-gray-500':'text-cyan-300'}">
                                                <i data-lucide="${isAbsent?'user-x':'scan-face'}" class="w-3.5 h-3.5"></i> ${isAbsent?'Absent':'Facial IA'}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4">
                                            <span class="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide inline-flex items-center gap-1.5 ${statusClass}">
                                                <span class="w-1.5 h-1.5 rounded-full ${isAbsent?'bg-rose-400':isLate?'bg-amber-400':'bg-emerald-400'}"></span>
                                                ${p.statut}
                                            </span>
                                        </td>
                                        <td class="py-4 px-4 text-right">
                                            <div class="flex items-center justify-end gap-1.5">
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
        const allPointages = getLivePointages(ecole);
        const presents = allPointages.filter(p => p.statut === 'Présent' || p.statut === 'Terminé').length;
        const retards = allPointages.filter(p => p.statut === 'Retard').length;
        const absents = allPointages.filter(p => p.statut === 'Absent').length;
        const total = allPointages.length;
        const rate = total > 0 ? Math.round((presents / total) * 100) : 0;

        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
            <title>Rapport Officiel de Présence - ${ecole}</title>
            <style>
                body{font-family:'Segoe UI',Arial,sans-serif;color:#111;margin:30px;line-height:1.4}
                .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px double #000;padding-bottom:15px;margin-bottom:20px}
                .school-title{font-size:18px;font-weight:900;text-transform:uppercase;margin:0;color:#0d8b6d}
                .school-sub{font-size:11px;color:#555;text-transform:uppercase;margin-top:3px;font-weight:bold}
                .report-title{text-align:center;margin:25px 0 15px}
                .report-title h1{font-size:20px;text-transform:uppercase;font-weight:900;margin:0;text-decoration:underline}
                .report-title p{font-size:12px;font-weight:bold;color:#333;margin-top:5px}
                .stats-box{display:flex;justify-content:space-around;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin-bottom:20px;text-align:center}
                .stat-item h4{margin:0;font-size:18px;font-weight:900;color:#0f172a}
                .stat-item p{margin:2px 0 0;font-size:10px;font-weight:bold;text-transform:uppercase;color:#64748b}
                table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
                th{background-color:#0f172a;color:#fff;padding:10px 8px;text-align:left;font-weight:bold;text-transform:uppercase;font-size:10px;letter-spacing:.5px;border:1px solid #0f172a}
                td{padding:8px;border:1px solid #cbd5e1}
                tr:nth-child(even){background-color:#f8fafc}
                .badge{display:inline-block;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:bold;text-transform:uppercase}
                .badge-present{background:#dcfce7;color:#15803d;border:1px solid #86efac}
                .badge-retard{background:#fef3c7;color:#b45309;border:1px solid #fde68a}
                .badge-absent{background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5}
                .footer{margin-top:40px;display:flex;justify-content:space-between;page-break-inside:avoid}
                .signature-box{width:220px;text-align:center;border-top:1px solid #000;padding-top:5px;font-size:11px;font-weight:bold}
                .certif{font-size:9px;color:#666;text-align:center;margin-top:30px;font-style:italic}
                @media print{body{margin:15mm 10mm}}
            </style></head><body>
            <div class="header">
                <div>
                    <h2 class="school-title">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                    <div class="school-sub">MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ</div>
                    <div class="school-sub" style="color:#0d8b6d;font-size:13px;margin-top:4px">${instName}</div>
                </div>
                <div style="text-align:right">
                    <div style="font-size:11px;font-weight:bold">SYSTÈME ERP DE SUPER-ADMINISTRATION</div>
                    <div style="font-size:10px;color:#666">Date d'édition : ${new Date().toLocaleString('fr-FR')}</div>
                    <div style="font-size:10px;color:#0d8b6d;font-weight:bold">Certification Biométrique Validée</div>
                </div>
            </div>
            <div class="report-title">
                <h1>RAPPORT OFFICIEL DE PRÉSENCE JOURNALIÈRE</h1>
                <p>Séance du ${today}</p>
            </div>
            <div class="stats-box">
                <div class="stat-item"><h4>${total}</h4><p>Effectif Total</p></div>
                <div class="stat-item"><h4 style="color:#15803d">${presents}</h4><p>Présents</p></div>
                <div class="stat-item"><h4 style="color:#b45309">${retards}</h4><p>Retards</p></div>
                <div class="stat-item"><h4 style="color:#b91c1c">${absents}</h4><p>Absents</p></div>
                <div class="stat-item"><h4 style="color:#0d8b6d">${rate}%</h4><p>Taux d'Assiduité</p></div>
            </div>
            <table>
                <thead><tr>
                    <th style="width:5%">N°</th>
                    <th style="width:30%">Nom & Prénom</th>
                    <th style="width:20%">Fonction / Rôle</th>
                    <th style="width:10%">École</th>
                    <th style="width:12%">Heure Arrivée</th>
                    <th style="width:12%">Heure Départ</th>
                    <th style="width:11%">Statut</th>
                </tr></thead>
                <tbody>
                    ${allPointages.map((p, idx) => `<tr>
                        <td style="text-align:center;font-weight:bold">${idx+1}</td>
                        <td style="font-weight:bold">${p.nom}</td>
                        <td>${p.role||'Personnel'}</td>
                        <td>${p.ecole}</td>
                        <td style="font-family:monospace;font-weight:bold">${p.arrivee}</td>
                        <td style="font-family:monospace">${p.depart!=='—'?p.depart:'En poste'}</td>
                        <td><span class="badge ${p.statut==='Absent'?'badge-absent':p.statut==='Retard'?'badge-retard':'badge-present'}">${p.statut}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <div class="footer">
                <div class="signature-box">Le Superviseur RH / Direction</div>
                <div class="signature-box">Le Chef d'Établissement (Sceau & Signature)</div>
            </div>
            <div class="certif">Document généré automatiquement — Reconnaissance Faciale IA • Harmonie & Retrouvailles</div>
            </body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    window.exportPresenceCSV = function(ecole) {
        const allPointages = getLivePointages(ecole);
        const headers = ['ID', 'Nom_Prenom', 'Role', 'Ecole', 'Arrivee', 'Depart', 'Statut', 'Methode'];
        const rows = allPointages.map(p => [
            p.id, '"' + p.nom + '"', '"' + (p.role||'Personnel') + '"', '"' + p.ecole + '"',
            p.arrivee, p.depart !== '—' ? p.depart : 'En poste', p.statut, 'Reconnaissance_Faciale_IA'
        ]);
        let csv = '\uFEFF' + headers.join(';') + '\n' + rows.map(r => r.join(';')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rapport_Presence_${ecole}_${new Date().toISOString().split('T')[0]}.csv`;
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
            row.style.display = (statut === 'all' || row.dataset.statut === statut) ? '' : 'none';
        });
    };

    window.filterPresenceTable = function(search) {
        const query = search.toLowerCase();
        document.querySelectorAll('.presence-row').forEach(row => {
            row.style.display = (row.dataset.name || '').includes(query) ? '' : 'none';
        });
    };

    window.printIndividualPresence = function(nom, role, arrivee, statut) {
        const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
            <title>Fiche Individuelle - ${nom}</title>
            <style>
                body{font-family:'Segoe UI',Arial,sans-serif;color:#111;margin:40px;line-height:1.5}
                .card{border:2px solid #0f172a;border-radius:12px;padding:25px}
                .header{text-align:center;border-bottom:2px solid #cbd5e1;padding-bottom:15px;margin-bottom:20px}
                .header h2{margin:0;font-size:16px;text-transform:uppercase;color:#0d8b6d}
                .header h1{margin:5px 0 0;font-size:20px;text-transform:uppercase;font-weight:900}
                .label{font-weight:bold;color:#475569;text-transform:uppercase;font-size:10px}
                .val{font-size:14px;font-weight:bold;margin-top:2px}
                .status-stamp{border:3px solid;padding:8px 15px;border-radius:8px;font-size:16px;font-weight:900;text-transform:uppercase;display:inline-block;transform:rotate(-3deg);margin:15px 0}
                .stamp-present{border-color:#15803d;color:#15803d}
                .stamp-retard{border-color:#b45309;color:#b45309}
                .stamp-absent{border-color:#b91c1c;color:#b91c1c}
                .footer-sigs{display:flex;justify-content:space-between;margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0}
                .sig-box{text-align:center;width:45%;font-size:12px}
                .sig-line{margin-top:40px;border-top:1px dashed #94a3b8;padding-top:5px;font-weight:bold}
                .certif{font-size:9px;color:#64748b;text-align:center;margin-top:15px;font-style:italic}
            </style></head><body>
            <div class="card">
                <div class="header">
                    <h2>Ministère de l'Éducation Nationale — R.D.C.</h2>
                    <h1>FICHE INDIVIDUELLE DE POINTAGE BIOMÉTRIQUE</h1>
                    <p style="font-size:11px;color:#64748b;margin-top:4px">Séance officielle du ${today}</p>
                </div>
                <table style="width:100%;font-size:13px;border-collapse:collapse">
                    <tr>
                        <td style="padding:10px 0;width:50%"><span class="label">Agent du Personnel :</span><div class="val">${nom}</div></td>
                        <td style="padding:10px 0"><span class="label">Rôle / Fonction :</span><div class="val">${role}</div></td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0"><span class="label">Heure de Pointage :</span><div class="val" style="font-family:monospace;font-size:18px">${arrivee||'—'}</div></td>
                        <td style="padding:10px 0"><span class="label">Mécanisme :</span><div class="val">Reconnaissance Faciale IA ✓</div></td>
                    </tr>
                </table>
                <div style="text-align:center;margin:20px 0">
                    <div class="status-stamp stamp-${statut==='Absent'?'absent':statut==='Retard'?'retard':'present'}">Pointage : ${statut}</div>
                </div>
                <div class="footer-sigs">
                    <div class="sig-box">Signature de l'Agent<div class="sig-line"></div></div>
                    <div class="sig-box">Visa de la Direction (RH)<div class="sig-line"></div></div>
                </div>
                <div class="certif">Empreinte faciale validée à 128 dimensions — Certifié conforme • Plateforme Harmonie-Retrouvailles</div>
            </div></body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    async function renderClasseVirtuelle() {
        let sessions = [];
        try {
            const res = await fetch('/api/visio');
            if (res.ok) sessions = await res.json();
        } catch(e) { console.error('Erreur fetch visio', e); }
        ui.content.innerHTML = `
            <div class="mb-6">
                <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <h3 class="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span class="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center"><i data-lucide="video" class="w-5 h-5 text-amber-400"></i></span>
                            Classe Virtuelle & Visioconférence EPST
                        </h3>
                        <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">Supervision Super-Admin & Lancement de séances CS Harmonie & GS Retrouvailles</p>
                    </div>
                    <div class="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span class="text-xs font-black text-amber-400 uppercase tracking-widest">Visioconférence Intégrée</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                        <h4 class="font-black text-sm uppercase tracking-widest text-gray-300 flex items-center gap-2">
                            <i data-lucide="plus-circle" class="w-4 h-4 text-amber-400"></i> Créer / Lancer une Séance
                        </h4>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Classe / Auditoire *</label>
                            <input id="vac-classe" type="text" placeholder="ex : 4ème Humanités / Réunion Direction"
                                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Objet / Cours *</label>
                            <input id="vac-objet" type="text" placeholder="ex : Conseil Pédagogique / Mathématiques"
                                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                        </div>
                        <button id="vac-start"
                            class="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer">
                            <i data-lucide="play" class="w-4 h-4"></i> Lancer la Visioconférence
                        </button>
                    </div>

                    <div class="lg:col-span-2 space-y-6">
                        <div id="vac-container" class="hidden bg-[#0A192F]/80 backdrop-blur-xl border border-amber-500/30 p-6 rounded-3xl shadow-xl">
                            <div class="flex items-center justify-between mb-4">
                                <h4 class="font-black text-sm uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Séance en Direct
                                </h4>
                                <button id="vac-stop" class="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-black hover:bg-red-500/40 transition flex items-center gap-2 cursor-pointer">
                                    <i data-lucide="square" class="w-3 h-3"></i> Fermer la Visioconférence
                                </button>
                            </div>
                            <div id="jitsi-admin-meet" class="w-full rounded-2xl overflow-hidden" style="height:420px;background:#0a0f1e;"></div>
                        </div>

                        <div class="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
                            <h4 class="font-black text-sm uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2">
                                <i data-lucide="history" class="w-4 h-4 text-blue-400"></i>
                                Toutes les Séances Virtuelles (${sessions.length})
                            </h4>
                            <div class="space-y-3">
                                ${sessions.length === 0 ? `
                                    <div class="text-center py-10 text-gray-500">
                                        <i data-lucide="video-off" class="w-10 h-10 mx-auto mb-3 opacity-30"></i>
                                        <p class="text-sm font-medium">Aucune séance enregistrée pour le moment</p>
                                        <p class="text-xs mt-1 opacity-60">Les cours virtuels lancés par la Direction ou les Professeurs apparaîtront ici.</p>
                                    </div>
                                ` : sessions.slice(0, 15).map(s => `
                                    <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                <i data-lucide="video" class="w-5 h-5 text-amber-400"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-white">${s.subject || s.matiere || 'Séance'} — ${s.className || s.classe || ''}</p>
                                                <p class="text-xs text-gray-400 mt-0.5">${s.teacher || s.enseignant || 'Direction'} • ${s.createdAt || s.date || ''}</p>
                                            </div>
                                        </div>
                                        <button onclick="window.rejoindreClasseAdmin('${s.roomName || ''}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${s.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-gray-700/50 text-gray-400 border border-gray-700'}">
                                            ${s.active ? 'Rejoindre ▶' : 'Terminée'}
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        setTimeout(bindVCEventsAdmin, 50);
    }

    function bindVCEventsAdmin() {
        const startBtn = document.getElementById('vac-start');
        const stopBtn = document.getElementById('vac-stop');

        if (startBtn) {
            startBtn.onclick = async () => {
                const classe = document.getElementById('vac-classe')?.value?.trim();
                const objet = document.getElementById('vac-objet')?.value?.trim();
                if (!classe || !objet) { alert("Veuillez renseigner la classe et l'objet de la séance."); return; }
                const roomName = ('HR-Admin-' + classe + '-' + objet + '-' + Date.now()).replace(/[^a-zA-Z0-9-]/g, '-');
                
                try {
                    await fetch('/api/visio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ room_name: roomName, titre: objet, initiateur: 'Direction (Super-Admin)', cibles: classe })
                    });
                } catch(e) { console.error('Erreur API visio', e); }

                window.rejoindreClasseAdmin(roomName);
                startBtn.disabled = true;
                startBtn.classList.add('opacity-50', 'cursor-not-allowed');
            };
        }

        if (stopBtn) {
            stopBtn.onclick = async () => {
                const container = document.getElementById('vac-container');
                const meetDiv = document.getElementById('jitsi-admin-meet');
                if (meetDiv) meetDiv.innerHTML = '';
                if (container) container.classList.add('hidden');
                if (startBtn) { startBtn.disabled = false; startBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }

                try {
                    const res = await fetch('/api/visio');
                    if (res.ok) {
                        const sessions = await res.json();
                        for (let s of sessions) {
                            await fetch('/api/visio', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ room_name: s.room_name })
                            });
                        }
                    }
                } catch(e) {}
            };
        }
    }

    window.rejoindreClasseAdmin = function(roomName) {
        if (!roomName) return;
        const container = document.getElementById('vac-container');
        const meetDiv = document.getElementById('jitsi-admin-meet');
        if (container) container.classList.remove('hidden');
        if (meetDiv && window.JitsiMeetExternalAPI) {
            meetDiv.innerHTML = '';
            new window.JitsiMeetExternalAPI('meet.jit.si', {
                roomName,
                width: '100%',
                height: 420,
                parentNode: meetDiv,
                userInfo: { displayName: 'Super-Admin EPST' },
                configOverwrite: { startWithAudioMuted: false, startWithVideoMuted: false }
            });
        } else if (meetDiv) {
            meetDiv.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                <i data-lucide="video" class="w-16 h-16 opacity-30 text-amber-400"></i>
                <p class="text-sm font-bold text-white">Salle de classe : ${roomName}</p>
                <a href="https://meet.jit.si/${encodeURIComponent(roomName)}" target="_blank"
                   class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-xl transition text-sm">
                    Ouvrir CS Harmonie & GS Retrouvailles
                </a></div>`;
            if (window.lucide) lucide.createIcons();
        }
    };

});

    // ==========================================
    // MENU SUPERVISION: DIRECTION GÉNÉRALE
    // ==========================================
    window.toggleDirectionGeneraleMenu = function(e) {
        if (e) e.stopPropagation();
        const el = document.getElementById('dropdown-direction-generale');
        if (el) el.classList.toggle('hidden');
    };
    document.addEventListener('click', function(e) {
        const btn = document.getElementById('btn-direction-generale');
        const menu = document.getElementById('dropdown-direction-generale');
        if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
