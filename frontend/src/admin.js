import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 19;

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
            { id: 1, nom: 'Mutombo Patient', date: '2026-07-13', statut: 'Présent', arrivee: '07:30', role: 'Direction', ecole: 'Harmonie' },
            { id: 2, nom: 'Kabila Joëlle', date: '2026-07-13', statut: 'Présent', arrivee: '07:45', role: 'Direction', ecole: 'Retrouvailles' },
            { id: 3, nom: 'Baya Paul', date: '2026-07-13', statut: 'Retard', arrivee: '08:25', role: 'Enseignant', ecole: 'Retrouvailles' },
            { id: 4, nom: 'Leki Christine', date: '2026-07-13', statut: 'Présent', arrivee: '07:55', role: 'Enseignant', ecole: 'Harmonie' },
            { id: 5, nom: 'Nkole Jean-Pierre', date: '2026-07-13', statut: 'Absent', arrivee: '—', role: 'Préfet', ecole: 'Harmonie' },
            { id: 6, nom: 'Tshilanda Marc', date: '2026-07-13', statut: 'Présent', arrivee: '07:40', role: 'Préfet', ecole: 'Retrouvailles' },
            { id: 7, nom: 'Kabongo Marie', date: '2026-07-13', statut: 'Présent', arrivee: '08:00', role: 'Comptable', ecole: 'Harmonie' }
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
    if (!user) { window.location.href = '/login.html'; return; }

    const ui = {
        name: document.getElementById('admin-name'),
        content: document.getElementById('main-content'),
        nav: document.querySelectorAll('.nav-item'),
        theme: document.getElementById('theme-toggle'),
        logout: document.getElementById('logout-btn')
    };

    if (ui.name) ui.name.textContent = `${user.prenom} ${user.nom}`;

    let currentView = 'dashboard';

    const renderView = () => {
        if (!ui.content) return;
        switch (currentView) {
            case 'dashboard': renderDashboard(); break;
            case 'pedagogie': renderPedagogie(); break;
            case 'rh': renderRH(); break;
            case 'finance': renderFinance(); break;
            case 'communication': renderCommunication(); break;
            case 'coffrefort': renderCoffreFort(); break;
            case 'suivi-direction': renderSuiviDirection(); break;
            case 'dossier360': renderDossier360(); break;
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
    if (ui.logout) ui.logout.onclick = () => { localStorage.clear(); window.location.href = '/login.html'; };

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
    // RENDER: DASHBOARD
    // ==========================================
    function renderDashboard() {
        const inst = db.institutions[db.ecoleActive];
        ui.content.innerHTML = `
            <div class="mb-8"><h2 class="text-3xl font-black dark:text-white uppercase tracking-tight">Tableau de Bord | ${db.ecoleActive}</h2></div>
            <div id="widgets" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                ${createKPI('Revenus', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-green-500', 'bg-green-50')}
                ${createKPI('Dépenses', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-500', 'bg-red-50')}
                ${createKPI('Inscrits', inst.pedagogie.eleves.length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${createKPI('SMS/WA', inst.comms.smsEnvoyes, 'message-square', 'text-purple-500', 'bg-purple-50')}
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-8 rounded-3xl shadow-xl border border-white/20"><h3 class="font-bold mb-6">Trésorerie</h3><div id="chartRev" class="h-80"></div></div>
                <div class="glass-panel p-8 rounded-3xl shadow-xl border border-white/20"><h3 class="font-bold mb-6">Scolarité</h3><div id="chartPed" class="h-80"></div></div>
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
                    <div class="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-10 w-fit shadow-inner">
                        <button id="tabM" class="px-8 py-3 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600 scale-105">Mobile Money</button>
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
                                <div class="p-4 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl text-xs text-gray-500 font-medium">
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
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-10 border dark:border-gray-700 shadow-inner h-full flex flex-col justify-between">
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
                        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Opérations du Jour</h3>
                        <div class="text-3xl font-black tracking-tighter mb-6">$${inst.finance.revenus.toLocaleString()} <span class="text-xs text-brand-400 uppercase tracking-widest font-bold block mt-1">+ Encaissés Aujourd'hui</span></div>
                        <button onclick="alert('Rapport de clôture hautement sécurisé généré et envoyé à la direction.')" class="w-full py-4 bg-white text-gray-900 font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <i data-lucide="lock" class="w-4 h-4"></i> Clôturer la Caisse
                        </button>
                    </div>

                    <!-- Panel Tarifs -->
                    <div class="glass-panel p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                        <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 flex justify-between">Tarification Officielle <i data-lucide="shield-check" class="w-3 h-3 text-brand-500"></i></h3>
                        <div class="space-y-3">
                            ${inst.finance.fraisScolaires.map(f => `
                                <div class="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl flex justify-between items-center hover:bg-brand-50 transition-all cursor-pointer border border-transparent hover:border-brand-100">
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
                                                    <div class="flex-1 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                        <div class="${color} h-full rounded-full transition-all duration-1000" style="width: ${pct}%"></div>
                                                    </div>
                                                    <span class="text-[9px] font-black uppercase text-gray-500 w-8 text-right">${pct}%</span>
                                                </div>
                                            `;
                }
            }

            return `
                                    <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td class="py-5 font-mono text-[11px] text-gray-400">#${p.id}</td>
                                        <td class="py-5">
                                            <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">${p.student}</div>
                                            <div class="text-[10px] text-gray-400 mt-1 uppercase font-bold flex gap-2 items-center">
                                                <span class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">${p.motif || 'N/A'}</span> • ${p.date}
                                            </div>
                                        </td>
                                        <td class="py-5 pr-8">
                                            ${progUI}
                                        </td>
                                        <td class="py-5">
                                            <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border ${p.mode === 'Mobile' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-700 border-gray-200'}">
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
        return `<div class="glass-panel p-6 rounded-3xl flex items-center gap-5 hover:translate-y-[-4px] transition-all cursor-move border border-white/20">
            <div class="w-14 h-14 rounded-2xl ${b} ${c} flex items-center justify-center"><i data-lucide="${i}" class="w-7 h-7"></i></div>
            <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">${t}</p><h4 class="text-3xl font-black dark:text-white">${v}</h4></div>
        </div>`;
    }

    function renderPedagogie() {
        const inst = db.institutions[db.ecoleActive];

        // Define action listeners
        window.approuverInscription = window.approuverInscription || function (id) {
            inst.pedagogie.nouvellesInscriptions = inst.pedagogie.nouvellesInscriptions.filter(i => i.id !== id);
            saveDb();
            renderPedagogie();
        };

        ui.content.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Pédagogie & Palmarès</h2>
                    <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Suivi académique et inscriptions</p>
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
                                <div class="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 flex justify-between items-center transition-all hover:shadow-md">
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
                        <div class="mt-8 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-gray-100 dark:border-gray-700 shadow-inner no-print">
                            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-4 sm:mb-0 uppercase tracking-wider">
                                <i data-lucide="info" class="w-4 h-4 text-brand-500"></i>
                                Exporter la liste d'attente
                            </div>
                            <div class="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
                                <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="window.print()">
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
                        <div class="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span class="font-bold uppercase text-sm">Effectif Total</span>
                            <span class="font-black text-xl text-brand-600">${inst.pedagogie.eleves.length}</span>
                        </div>
                        <div class="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span class="font-bold uppercase text-sm">Classes Actives</span>
                            <span class="font-black text-xl text-blue-600">${inst.pedagogie.classes.length}</span>
                        </div>
                        ${db.ecoleActive === 'Retrouvailles' ? `
                        <div class="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
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
                <div class="mt-8 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-gray-100 dark:border-gray-700 shadow-inner no-print">
                    <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-4 sm:mb-0 uppercase tracking-wider">
                        <i data-lucide="users" class="w-4 h-4 text-blue-500"></i>
                        Générer un registre officiel
                    </div>
                    <div class="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
                        <button class="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md font-black rounded-xl transition-all duration-300 hover:scale-105 active:scale-95" onclick="window.print()">
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
            <div class="flex flex-wrap bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-8 w-fit shadow-inner gap-1">
                <button id="rh-tab-comptes" onclick="rhTab('comptes')" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600">👤 Comptes & Accès</button>
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
                                <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td class="py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl ${roleColors[c.role]||'bg-gray-100 text-gray-600'} flex items-center justify-center font-black text-sm">${(c.prenom[0]||'')+(c.nom[0]||'')}</div>
                                            <div>
                                                <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                                <p class="text-xs text-gray-400">${c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-5">
                                        <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${roleColors[c.role]||'bg-gray-100 text-gray-600'}">${c.role}</span>
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
                        <button class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                            <i data-lucide="qr-code" class="w-4 h-4"></i> Scanner Empreinte / QR
                        </button>
                    </div>
                    <table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b dark:border-gray-700">
                            <tr><th class="pb-5">Employé</th><th class="pb-5">Rôle</th><th class="pb-5">Arrivée</th><th class="pb-5">Statut</th><th class="pb-5 text-right">Action</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${allPointages.map(p => `
                                <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td class="py-4 font-bold dark:text-white">${p.nom}</td>
                                    <td class="py-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${roleColors[p.role]||'bg-gray-100 text-gray-600'}">${p.role||'—'}</span></td>
                                    <td class="py-4 font-mono text-sm">${p.arrivee}</td>
                                    <td class="py-4"><span class="px-3 py-1.5 rounded-full text-xs font-black uppercase ${statutPColors[p.statut]||''}">${p.statut}</span></td>
                                    <td class="py-4 text-right">
                                        <button onclick="alert('Modification du pointage de ${p.nom}')" class="text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-bold">Corriger</button>
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
                            <div class="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
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
                                <select onchange="alert('Classe \"' + this.value + '\" ajoutée à ${c.prenom} ${c.nom}'); this.value='';" class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
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
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 z-10 w-64 text-center shadow-md bg-white dark:bg-gray-800">
                                        <div class="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm mb-2">${c.prenom[0]}${c.nom[0]}</div>
                                        <p class="font-bold dark:text-white">${c.prenom} ${c.nom}</p>
                                        <p class="text-xs font-black text-indigo-500 uppercase mt-1">Directeur Primaire</p>
                                    </div>
                                `).join('')}
                                <div class="h-8 w-0.5 bg-gray-300 dark:bg-gray-600 my-2"></div>
                                <!-- Sur Ecole -->
                                ${allComptes.filter(c => c.role === 'Sur école').map(c => `
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-cyan-200 dark:border-cyan-800 z-10 w-64 text-center shadow-sm bg-white dark:bg-gray-800">
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
                                        <div class="glass-panel px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 w-48 text-center bg-gray-50 dark:bg-gray-800/50">
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
                                    <div class="glass-panel px-6 py-4 rounded-2xl border border-purple-300 dark:border-purple-700 z-10 w-64 text-center shadow-md bg-white dark:bg-gray-800">
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
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-800 z-10 w-48 text-center shadow-sm bg-white dark:bg-gray-800">
                                                <p class="font-bold dark:text-white text-sm">${c.prenom} ${c.nom}</p>
                                                <p class="text-[10px] font-black text-rose-500 uppercase mt-1">Dir. des Études</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <!-- D.D -->
                                    <div class="flex flex-col items-center">
                                        ${allComptes.filter(c => c.role === 'D.D').map(c => `
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 z-10 w-48 text-center shadow-sm bg-white dark:bg-gray-800">
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
                                            <div class="glass-panel px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 w-48 text-center bg-gray-50 dark:bg-gray-800/50">
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
                <div class="glass-panel bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl border border-white/20">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="text-xl font-black dark:text-white uppercase tracking-tighter">Créer un Compte Personnel</h3>
                        <button onclick="document.getElementById('modal-create-compte').classList.add('hidden')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
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
                            <button type="button" onclick="document.getElementById('modal-create-compte').classList.add('hidden')" class="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">Annuler</button>
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
            
            roleSelect.innerHTML = options.map(o => \`<option value="\${o}">\${o}</option>\`).join('');
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
                        ? 'px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600'
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
        ui.content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Communication</h2>
                <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">SMS & Rappels Automatiques</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/20 flex flex-col items-center justify-center text-center">
                    <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <i data-lucide="message-square" class="w-10 h-10 text-purple-600"></i>
                    </div>
                    <div class="text-4xl font-black mb-2">${inst.comms.smsEnvoyes}</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">SMS Envoyés Ce Mois</div>
                    <button class="mt-8 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition">Nouvelle Campagne SMS</button>
                </div>
                <div class="glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/20 flex flex-col items-center justify-center text-center">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <i data-lucide="smartphone" class="w-10 h-10 text-green-600"></i>
                    </div>
                    <div class="text-4xl font-black mb-2">${inst.comms.whatsappEnvoyes}</div>
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp Envoyés</div>
                    <button class="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition">Configurer API WhatsApp</button>
                </div>
            </div>
        `;
    }

    function renderCoffreFort() {
        ui.content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Coffre-fort Numérique</h2>
                <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Sécurité des documents</p>
            </div>
            <div class="glass-panel p-16 rounded-[2.5rem] shadow-xl border border-white/20 text-center flex flex-col items-center">
                <i data-lucide="shield-check" class="w-24 h-24 text-gold-500 mb-6 drop-shadow-lg"></i>
                <h3 class="text-2xl font-black mb-4">Espace Hautement Sécurisé</h3>
                <p class="text-gray-500 max-w-md mx-auto mb-8">Accédez aux archives, documents officiels, et sauvegardes de base de données. L'accès nécessite une double authentification.</p>
                <div class="flex gap-4">
                    <input type="password" placeholder="Mot de passe Maître" class="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500">
                    <button class="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl shadow-lg hover:scale-105 transition">Déverrouiller</button>
                </div>
            </div>
        `;
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
                        <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
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
                                        <div class="flex-1 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
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
                                    <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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
                            <button onclick="alert('Rapport exporté !')" class="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
                                <i data-lucide="download" class="w-4 h-4 text-gray-400 group-hover:text-brand-600"></i>
                                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600">Exporter le journal PDF</span>
                            </button>
                            <button onclick="alert('Rapport envoyé par email !')" class="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
                                <i data-lucide="mail" class="w-4 h-4 text-gray-400 group-hover:text-brand-600"></i>
                                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600">Envoyer rapport par email</span>
                            </button>
                            <button onclick="currentView='rh'; renderView();" class="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition text-left group">
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
                        <select id="cascade-classe" class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
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
                        <select id="cascade-option" class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
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
                <select class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium">
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
                    <input type="text" id="search-eleve-360" placeholder="Entrez le nom de l'élève (ex: MUKENDI KABUYA)" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
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
                        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <form id="form-send-parent" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type d'information</label>
                                    <select class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
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
                                    <div class="flex bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-2xl mb-4 w-fit shadow-inner border border-gray-200 dark:border-gray-700">
                                        <button type="button" id="btn-target-indiv" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-800 shadow-md text-brand-600 scale-105">Individuel (Élève)</button>
                                        <button type="button" id="btn-target-group" class="px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Groupe (Classe)</button>
                                    </div>
                                    
                                    <!-- Input for Individual -->
                                    <div id="target-individual" class="animate-fade-in">
                                        <input type="text" placeholder="Rechercher l'élève (Ex: MUKENDI KABUYA)" class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                                    </div>
                                    
                                    <!-- Select for Group -->
                                    <div id="target-group" class="hidden animate-fade-in">
                                        ${groupOptionsHtml}
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Détails / Contenu</label>
                                    <textarea rows="3" placeholder="Saisissez le contenu à envoyer..." class="w-full px-4 py-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"></textarea>
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
                                            <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-all">
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
                                    <div id="file-preview" class="hidden mt-3 p-3 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-3">
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
                        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <h4 class="font-bold text-gray-700 dark:text-white mb-6 uppercase tracking-wider text-sm border-b dark:border-gray-700 pb-2">Derniers envois</h4>
                            <div class="space-y-4">
                                <div class="p-4 bg-white dark:bg-[#112240] rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div class="p-2 bg-amber-100 text-amber-600 rounded-lg"><i data-lucide="book-open" class="w-4 h-4"></i></div>
                                    <div>
                                        <p class="text-sm font-bold dark:text-white">Devoir de Mathématiques</p>
                                        <p class="text-xs text-gray-500">Envoyé à: 3ème Humanité (Scientifique)</p>
                                        <p class="text-[10px] text-gray-400 mt-1 font-mono">Il y a 2 heures</p>
                                    </div>
                                </div>
                                <div class="p-4 bg-white dark:bg-[#112240] rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-4 hover:shadow-md transition-shadow">
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
                    btnIndiv.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-800 shadow-md text-brand-600 scale-105";
                    btnGroup.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
                };
                btnGroup.onclick = () => {
                    targetGroup.classList.remove('hidden');
                    targetIndiv.classList.add('hidden');
                    btnGroup.className = "px-6 py-2.5 text-sm font-black rounded-xl transition-all bg-white dark:bg-gray-800 shadow-md text-brand-600 scale-105";
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
                return { icon: 'file', color: 'bg-gray-100 text-gray-600' };
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
});
