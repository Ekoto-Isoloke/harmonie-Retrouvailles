import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 9;

const defaultData = {
    version: DB_VERSION,
    ecoleActive: 'Harmonie',
    institutions: {
        Harmonie: {
            finance: {
                revenus: 45000,
                depenses: 12000,
                fraisScolaires: [
                    { classe: 'Maternelle', montant: 450, devise: 'USD' },
                    { classe: '1ère Primaire', montant: 600, devise: 'USD' },
                    { classe: '2ème Primaire', montant: 600, devise: 'USD' }
                ],
                recentPayments: [
                    { id: '101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Frais Juin', mode: 'Mobile', classe: '1ère Primaire' },
                    { id: '102', student: 'Kabea Sarah', amount: 50, date: '2026-06-26', motif: 'Reliquat', mode: 'Caisse', classe: 'Maternelle' }
                ]
            },
            pedagogie: {
                enseignants: ['Kalombo Jean', 'Mutombo Sarah'],
                classes: ['Maternelle', '1ère Primaire', '2ème Primaire'],
                eleves: [
                    { nom: 'Leki Marc', classe: '1ère Primaire', paye: 150 },
                    { nom: 'Kabea Sarah', classe: 'Maternelle', paye: 400 },
                    { nom: 'Mbuyi Paul', classe: '2ème Primaire', paye: 0 },
                    { nom: 'Ngalula Rose', classe: '1ère Primaire', paye: 600 }
                ]
            },
            comms: { smsEnvoyes: 800, whatsappEnvoyes: 200 }
        },
        Retrouvailles: {
            finance: {
                revenus: 25000,
                depenses: 8000,
                fraisScolaires: [
                    { classe: '7ème EB', montant: 850, devise: 'USD' },
                    { classe: '1ère Humanités', montant: 1200, devise: 'USD' }
                ],
                recentPayments: [
                    { id: '201', student: 'Baya Paul', amount: 100, date: '2026-06-24', motif: 'Inscription', mode: 'Mobile', classe: '7ème EB' }
                ]
            },
            pedagogie: {
                enseignants: ['Kabongo David', 'Ilunga Pierre'],
                classes: ['7ème EB', '1ère Humanités'],
                eleves: [
                    { nom: 'Baya Paul', classe: '7ème EB', paye: 100 },
                    { nom: 'Tshilanda Alice', classe: '1ère Humanités', paye: 0 },
                    { nom: 'Kasongo Joel', classe: '7ème EB', paye: 850 }
                ]
            },
            comms: { smsEnvoyes: 445, whatsappEnvoyes: 140 }
        }
    },
    rh: {
        comptes: [
            { id: 1, nom: 'Kalombo', prenom: 'Jean', role: 'Enseignant', statut: 'Actif', ecole: 'Harmonie' },
            { id: 2, nom: 'Ngalula', prenom: 'Marie', role: 'Parent', statut: 'Actif', ecole: 'Retrouvailles' },
            { id: 3, nom: 'Ilunga', prenom: 'Pierre', role: 'Enseignant', statut: 'Actif', ecole: 'Retrouvailles' }
        ],
        pointages: [
            { nom: 'Kalombo Jean', date: '2026-06-26', statut: 'Présent', arrivee: '07:15', depart: '14:30', ecole: 'Harmonie' }
        ]
    },
    commsGlobal: { autoSmsRetard: true, autoWaRappel: false }
};

// Database Setup
let db;
try {
    let stored = localStorage.getItem('admin_db');
    db = stored ? JSON.parse(stored) : defaultData;
    if (!db.version || db.version < DB_VERSION) { db = defaultData; localStorage.setItem('admin_db', JSON.stringify(db)); }
} catch (e) { db = defaultData; }

const saveDb = () => localStorage.setItem('admin_db', JSON.stringify(db));

// ==========================================
// MAIN INTERFACE CONTROLLER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // Auth
    const user = JSON.parse(localStorage.getItem('hr_user'));
    if (!user) { window.location.href = '/login.html'; return; }
    const nameEl = document.getElementById('admin-name');
    if (nameEl) nameEl.textContent = `${user.prenom} ${user.nom}`;

    const mainContent = document.getElementById('main-content');
    let currentView = 'dashboard';

    const renderCurrentView = () => {
        if (!mainContent) return;
        switch (currentView) {
            case 'dashboard': renderDashboard(); break;
            case 'pedagogie': renderPedagogie(); break;
            case 'rh': renderRH(); break;
            case 'finance': renderFinance(); break;
            case 'communication': renderCommunication(); break;
            case 'coffrefort': renderCoffreFort(); break;
        }
        if (window.lucide) lucide.createIcons();
    };

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.target;
            renderCurrentView();
        });
    });

    // Theme & Logout
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            renderCurrentView(); // Reload charts for theme
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('hr_token');
            localStorage.removeItem('hr_user');
            window.location.href = '/login.html';
        };
    }

    renderCurrentView();
    initProFeatures();

    function initProFeatures() {
        initInstitutionSwitcher();
        initLiveActivity();
        initCommandPalette();
        initSpeedDial();
    }

    // ==========================================
    // MODULE RENDERS (RESTORED ORIGINAL DESIGN)
    // ==========================================

    function renderDashboard() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Vue d'ensemble - ${db.ecoleActive}</h2>
                <p class="text-gray-500 text-sm mt-1">Performances et KPIs en temps réel.</p>
            </div>

            <div id="dashboard-widgets" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                ${createKPICard('Revenus Mensuels', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-green-500', 'bg-green-50')}
                ${createKPICard('Dépenses / Paie', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-500', 'bg-red-50')}
                ${createKPICard('Comptes Actifs', db.rh.comptes.filter(u => u.ecole === db.ecoleActive).length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${createKPICard('Messages Envoyés', inst.comms.smsEnvoyes + inst.comms.whatsappEnvoyes, 'message-circle', 'text-purple-500', 'bg-purple-50')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-8 rounded-3xl shadow-xl border border-white/20">
                    <h3 class="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <i data-lucide="bar-chart-3" class="w-5 h-5 text-brand-500"></i> Flux Financier
                    </h3>
                    <div id="financeChart" class="h-80 w-full"></div>
                </div>
                <div class="glass-panel p-8 rounded-3xl shadow-xl border border-white/20">
                    <h3 class="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <i data-lucide="pie-chart" class="w-5 h-5 text-gold-500"></i> Démographie Scolaire
                    </h3>
                    <div id="demoChart" class="h-80 w-full flex justify-center"></div>
                </div>
            </div>
        `;
        setTimeout(initCharts, 100);
        if (window.dragula) {
            const container = document.getElementById('dashboard-widgets');
            if (container) dragula([container]);
        }
    }

    function renderFinance() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8"><h2 class="text-3xl font-black text-gray-900 dark:text-white">Finances & Gestion de Caisse</h2></div>
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div class="xl:col-span-2 glass-panel p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/20">
                    <div class="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                        <button id="tab-momo" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600">Mobile Money</button>
                        <button id="tab-caisse" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all text-gray-500 hover:text-gray-700">Paiement Caisse</button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div class="lg:col-span-3 space-y-6">
                            <div id="momo-fields" class="space-y-6">
                                <div><label class="premium-label">Elève / Payeur</label>
                                <select id="pay-student" class="premium-select">
                                    <option value="" disabled selected>Choisir un élève...</option>
                                    ${inst.pedagogie.eleves.map(e => `<option value="${e.nom}">${e.nom} (${e.classe})</option>`).join('')}
                                </select></div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div><label class="premium-label">Opérateur</label><select class="premium-select"><option>M-Pesa</option><option>Airtel</option><option>Orange</option></select></div>
                                    <div><label class="premium-label">Téléphone</label><input type="text" placeholder="+243..." class="premium-input"></div>
                                </div>
                            </div>
                            <div id="caisse-fields" class="hidden space-y-6">
                                <div><label class="premium-label">Nom de l'élève (Caisse)</label>
                                <select id="caisse-student" class="premium-select">
                                    <option value="" disabled selected>Sélectionner l'élève...</option>
                                    ${inst.pedagogie.eleves.map(e => `<option value="${e.nom}">${e.nom}</option>`).join('')}
                                </select></div>
                                <div><label class="premium-label">Classe de référence</label><input id="caisse-class-display" type="text" readonly placeholder="Auto-détecté" class="premium-input bg-gray-50 dark:bg-gray-800/50"></div>
                                <div><label class="premium-label">Type de Perception</label><select id="caisse-motif" class="premium-select"><option>Minerval</option><option>Cantine</option><option>Transport</option></select></div>
                            </div>
                            <div><label class="premium-label">Montant à verser (USD)</label><input id="pay-amount" type="number" placeholder="0.00" class="premium-input text-2xl font-black text-brand-600"></div>
                            <button id="btn-submit-payment" class="premium-btn w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3">CONFIRMER LA TRANSACTION</button>
                        </div>
                        <div class="lg:col-span-2 space-y-6">
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border dark:border-gray-700 shadow-inner">
                                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Etat de Compte</h4>
                                <div class="space-y-4">
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs text-gray-500">Total dû</span><span id="stat-total" class="font-bold text-gray-800 dark:text-gray-200">$ 0</span></div>
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs text-gray-500">Déjà payé</span><span id="stat-paid" class="font-bold text-green-500">$ 0</span></div>
                                    <div class="pt-6"><span class="text-[10px] font-bold text-orange-500 uppercase">Reste à payer</span><div id="stat-balance" class="text-4xl font-black text-orange-600 tracking-tighter">$ 0</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="glass-panel p-6 rounded-3xl border border-white/20">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Grille des Frais</h3>
                        <div class="space-y-3">
                            ${inst.finance.fraisScolaires.map(f => `
                                <div class="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex justify-between items-center group hover:bg-brand-50 transition-colors">
                                    <span class="text-xs font-bold text-gray-600 dark:text-gray-400">${f.classe}</span>
                                    <span class="text-sm font-black text-brand-600">$${f.montant}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="xl:col-span-3 glass-panel p-8 rounded-[2rem] shadow-sm">
                    <h3 class="text-xl font-extrabold text-gray-800 dark:text-white mb-6">Historique des Transactions</h3>
                    <div class="overflow-x-auto"><table class="w-full text-left text-sm">
                        <thead class="text-[10px] text-gray-400 uppercase border-b dark:border-gray-700"><th class="pb-4 px-2">Référence</th><th class="pb-4">Elève</th><th class="pb-4 text-center">Mode</th><th class="pb-4">Motif</th><th class="pb-4 text-right">Montant</th></thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                            ${inst.finance.recentPayments.map(p => `
                                <tr class="hover:bg-gray-50/10">
                                    <td class="py-5 px-2 font-mono text-[10px] text-gray-400">#${p.id}</td>
                                    <td><div class="font-bold">${p.student}</div><div class="text-[10px] text-gray-400">${p.classe || 'N/A'}</div></td>
                                    <td class="text-center"><span class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${p.mode === 'Mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gold-100 text-gold-700'}">${p.mode}</span></td>
                                    <td class="text-xs text-gray-500">${p.motif}</td>
                                    <td class="text-right font-black text-brand-600 text-base">$${p.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table></div>
                </div>
            </div>
        `;
        initFinanceLogic();
    }

    function renderPedagogie() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8 flex justify-between items-center">
                <h2 class="text-3xl font-black text-gray-900 dark:text-white">Pédagogie & Palmarès</h2>
                <button class="px-5 py-2.5 bg-gold-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"><i data-lucide="file-text"></i> Générer Palmarès EPST</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="glass-panel p-6 rounded-3xl"><h3 class="font-bold mb-4">Classes</h3>
                    <div class="space-y-2 uppercase text-xs font-black">
                        ${inst.pedagogie.classes.map(c => `<div class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">${c}</div>`).join('')}
                    </div>
                </div>
                <div class="md:col-span-2 glass-panel p-6 rounded-3xl"><h3 class="font-bold mb-4">Registre des Elèves</h3>
                    <div class="space-y-3">
                        ${inst.pedagogie.eleves.map(e => `
                            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <span class="font-bold">${e.nom}</span>
                                <span class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-500">${e.classe}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderRH() {
        mainContent.innerHTML = `
            <div class="mb-8"><h2 class="text-3xl font-black text-gray-900 dark:text-white">RH & Pointages Biométriques</h2></div>
            <div class="glass-panel rounded-3xl p-1 overflow-hidden shadow-xl border border-white/10 mb-10">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-400 uppercase tracking-widest"><th class="p-6">Agent</th><th>Rôle</th><th>Institution</th><th>Statut</th></tr></thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        ${db.rh.comptes.filter(u => u.ecole === db.ecoleActive).map(u => `
                            <tr class="hover:bg-gray-50/50">
                                <td class="p-6 font-bold flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-brand-100"></div>${u.nom} ${u.prenom}</td>
                                <td class="text-sm">${u.role}</td>
                                <td class="text-xs">${u.ecole}</td>
                                <td><span class="px-3 py-1 text-[10px] font-bold rounded-full ${u.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${u.statut}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <h3 class="font-bold mb-4">Pointages du Jour</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                ${db.rh.pointages.filter(p => p.ecole === db.ecoleActive).map(p => `
                    <div class="glass-panel p-5 rounded-2xl border-l-4 border-green-500 shadow-md">
                        <p class="font-bold">${p.nom}</p>
                        <p class="text-[10px] text-gray-500 mt-1">Arrivée: ${p.arrivee}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderCommunication() {
        mainContent.innerHTML = `<div class="p-8"><h2 class="text-3xl font-black mb-8">Communication Hybride</h2><div class="glass-panel p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">Bientôt: Intégration API WhatsApp & Twilio</div></div>`;
    }

    function renderCoffreFort() {
        mainContent.innerHTML = `<div class="p-8"><h2 class="text-3xl font-black mb-8">Coffre-fort Documents</h2><div class="glass-panel p-20 rounded-[3rem] bg-brand-900 text-white text-center shadow-2xl">Déposez les documents ici</div></div>`;
    }

    // ==========================================
    // LOGIC HELPERS
    // ==========================================

    function initInstitutionSwitcher() {
        const bH = document.getElementById('switch-harmonie');
        const bR = document.getElementById('switch-retrouvailles');
        if (!bH || !bR) return;
        const update = () => {
            bH.className = db.ecoleActive === 'Harmonie' ? "active-inst" : "inactive-inst";
            bR.className = db.ecoleActive === 'Retrouvailles' ? "active-inst" : "inactive-inst";
        };
        bH.onclick = () => { db.ecoleActive = 'Harmonie'; saveDb(); update(); renderCurrentView(); };
        bR.onclick = () => { db.ecoleActive = 'Retrouvailles'; saveDb(); update(); renderCurrentView(); };
        update();
    }

    function initFinanceLogic() {
        const inst = db.institutions[db.ecoleActive];
        const tabM = document.getElementById('tab-momo');
        const tabC = document.getElementById('tab-caisse');
        const fM = document.getElementById('momo-fields');
        const fC = document.getElementById('caisse-fields');
        const btn = document.getElementById('btn-submit-payment');
        let m = 'Mobile';

        const update = (name) => {
            const stu = inst.pedagogie.eleves.find(e => e.nom === name);
            if (!stu) return;
            const fee = inst.finance.fraisScolaires.find(f => f.classe === stu.classe);
            const tot = fee ? fee.montant : 0;
            const bal = tot - stu.paye;
            const el = (id, val) => { const x = document.getElementById(id); if (x) x.textContent = val; };
            el('stat-total', `$ ${tot}`); el('stat-paid', `$ ${stu.paye}`); el('stat-balance', `$ ${bal}`);
            const cls = document.getElementById('caisse-class-display');
            if (m === 'Caisse' && cls) cls.value = stu.classe;
        };

        const sM = document.getElementById('pay-student');
        const sC = document.getElementById('caisse-student');
        if (sM) sM.onchange = (e) => update(e.target.value);
        if (sC) sC.onchange = (e) => update(e.target.value);

        if (tabM && tabC) {
            tabM.onclick = () => { m = 'Mobile'; fM.classList.remove('hidden'); fC.classList.add('hidden'); tabM.className = "active-tab-momo"; tabC.className = "inactive-tab"; };
            tabC.onclick = () => { m = 'Caisse'; fC.classList.remove('hidden'); fM.classList.add('hidden'); tabC.className = "active-tab-caisse"; tabM.className = "inactive-tab"; };
        }

        if (btn) {
            btn.onclick = () => {
                const name = m === 'Mobile' ? sM.value : sC.value;
                const amt = parseFloat(document.getElementById('pay-amount').value);
                if (!name || isNaN(amt)) return alert('Données invalides !');
                const stu = inst.pedagogie.eleves.find(e => e.nom === name);
                btn.disabled = true; btn.innerHTML = 'TRAITEMENT...';
                setTimeout(() => {
                    const tx = { id: Date.now().toString().slice(-5), student: name, amount: amt, mode: m, motif: 'Frais', date: new Date().toLocaleDateString(), classe: stu.classe };
                    inst.finance.recentPayments.unshift(tx); stu.paye += amt; inst.finance.revenus += amt;
                    saveDb(); renderFinance();
                    showProReceipt({ client: name, amount: amt, mode: m, classe: stu.classe, reste: (inst.finance.fraisScolaires.find(f => f.classe === stu.classe).montant - stu.paye) });
                }, 1000);
            };
        }
    }

    function showProReceipt(data) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('r-client', data.client); set('r-amount', `$${data.amount}`); set('r-mode', data.mode);
        modal.classList.remove('hidden');
        const body = document.querySelector('.receipt-body');
        if (body) {
            const d = document.createElement('div'); d.className = 'mt-3 pt-3 border-t border-gray-100 text-[10px]';
            d.innerHTML = `<div class="flex justify-between"><span>Solde Reste:</span><b>$${data.reste}</b></div>`;
            body.appendChild(d);
        }
        const qr = document.getElementById('r-qrcode');
        if (qr && window.QRCode) { qr.innerHTML = ''; new QRCode(qr, { text: `VALID:${data.client}`, width: 80, height: 80 }); }
    }

    function initCharts() {
        if (!window.ApexCharts) return;
        const isDark = document.documentElement.classList.contains('dark');
        const color = isDark ? '#fff' : '#374151';
        const inst = db.institutions[db.ecoleActive];

        // Revenue Chart
        const options1 = {
            series: [{ name: 'Revenus', data: [31, 40, 28, 51, 42, 109, inst.finance.revenus / 1000] }],
            chart: { type: 'area', height: 320, toolbar: { show: false }, background: 'transparent' },
            colors: ['#22c55e'], stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'], labels: { style: { colors: color } } },
            yaxis: { labels: { style: { colors: color } } },
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const el1 = document.querySelector("#financeChart");
        if (el1) { if (window.chart1) chart1.destroy(); window.chart1 = new ApexCharts(el1, options1); chart1.render(); }

        // Demo Chart
        const options2 = {
            series: [44, 55, 13, 33],
            chart: { type: 'donut', height: 320, background: 'transparent' },
            labels: ['Maternelle', 'Primaire', 'CTEB', 'Humanités'],
            colors: ['#c7882c', '#22c55e', '#3b82f6', '#8b5cf6'],
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const el2 = document.querySelector("#demoChart");
        if (el2) { if (window.chart2) chart2.destroy(); window.chart2 = new ApexCharts(el2, options2); chart2.render(); }
    }

    // Utility Card
    function createKPICard(title, val, icon, color, bg) {
        return `<div class="glass-panel p-6 rounded-3xl flex items-center gap-4 hover:translate-y-[-4px] transition-all cursor-move shadow-lg">
            <div class="w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center"><i data-lucide="${icon}"></i></div>
            <div><p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">${title}</p><h4 class="text-2xl font-black dark:text-white">${val}</h4></div>
        </div>`;
    }

    function initLiveActivity() { }
    function initCommandPalette() { }
    function initSpeedDial() { }

    const closeReceipt = document.getElementById('close-receipt');
    if (closeReceipt) closeReceipt.onclick = () => document.getElementById('receipt-modal').classList.add('hidden');
});
