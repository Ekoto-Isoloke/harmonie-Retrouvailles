import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 8;

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
                    { id: 'TX-101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Frais Juin', mode: 'Mobile', classe: '1ère Primaire' },
                    { id: 'TX-102', student: 'Kabea Sarah', amount: 50, date: '2026-06-26', motif: 'Reliquat', mode: 'Caisse', classe: 'Maternelle' }
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
            comms: {
                smsEnvoyes: 800,
                whatsappEnvoyes: 200
            }
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
                    { id: 'TX-201', student: 'Baya Paul', amount: 100, date: '2026-06-24', motif: 'Inscription', mode: 'Mobile', classe: '7ème EB' }
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
            comms: {
                smsEnvoyes: 445,
                whatsappEnvoyes: 140
            }
        }
    },
    rh: {
        comptes: [
            { id: 1, nom: 'Kalombo', prenom: 'Jean', role: 'Enseignant', statut: 'Actif', ecole: 'Harmonie' },
            { id: 2, nom: 'Ngalula', prenom: 'Marie', role: 'Parent', statut: 'Actif', ecole: 'Retrouvailles' },
            { id: 3, nom: 'Tshibangu', prenom: 'Paul', role: 'Agent', statut: 'Suspendu', ecole: 'Harmonie' },
            { id: 4, nom: 'Ilunga', prenom: 'Pierre', role: 'Enseignant', statut: 'Actif', ecole: 'Retrouvailles' }
        ],
        pointages: [
            { nom: 'Kalombo Jean', date: '2026-06-26', statut: 'Présent', arrivee: '07:15', depart: '14:30', ecole: 'Harmonie' },
            { nom: 'Ilunga Pierre', date: '2026-06-26', statut: 'Absent', arrivee: '--:--', depart: '--:--', ecole: 'Retrouvailles' }
        ]
    },
    commsGlobal: {
        autoSmsRetard: true,
        autoWaRappel: false
    }
};

// Initialize DB
let db;
try {
    let storedDb = localStorage.getItem('admin_db');
    db = storedDb ? JSON.parse(storedDb) : defaultData;
    if (!db.version || db.version < DB_VERSION || !db.institutions) {
        db = defaultData;
        localStorage.setItem('admin_db', JSON.stringify(db));
    }
} catch (e) {
    db = defaultData;
    localStorage.setItem('admin_db', JSON.stringify(db));
}

const saveDb = () => localStorage.setItem('admin_db', JSON.stringify(db));

// ==========================================
// CORE INTERFACE LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem('hr_user'));
    if (!user) { window.location.href = '/login.html'; return; }

    // Safety check for UI elements
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

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.target;
            renderCurrentView();
        });
    });

    // Start UI
    renderCurrentView();
    initProFeatures();

    function initProFeatures() {
        initSpeedDial();
        initCommandPalette();
        initLiveActivity();
        initInstitutionSwitcher();
    }

    function initInstitutionSwitcher() {
        const btnH = document.getElementById('switch-harmonie');
        const btnR = document.getElementById('switch-retrouvailles');
        if (!btnH || !btnR) return;

        const update = () => {
            btnH.className = db.ecoleActive === 'Harmonie' ? "active-inst" : "inactive-inst";
            btnR.className = db.ecoleActive === 'Retrouvailles' ? "active-inst" : "inactive-inst";
        };
        btnH.onclick = () => { db.ecoleActive = 'Harmonie'; saveDb(); update(); renderCurrentView(); };
        btnR.onclick = () => { db.ecoleActive = 'Retrouvailles'; saveDb(); update(); renderCurrentView(); };
        update();
    }

    // ==========================================
    // MODULE: FINANCE (PREMIUM)
    // ==========================================

    function renderFinance() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8 relative">
                <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Finances & Gestion de Caisse</h2>
                <div class="flex items-center gap-2 mt-2">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p class="text-gray-500 text-sm font-medium uppercase tracking-widest">${db.ecoleActive} - Terminal de Paiement v2.5</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div class="xl:col-span-2 glass-panel p-8 rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-700/50 relative overflow-hidden">
                    <div class="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-8 w-fit">
                        <button id="tab-momo" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 bg-white dark:bg-gray-700 shadow-md text-brand-600">Mobile Money</button>
                        <button id="tab-caisse" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 text-gray-500 hover:text-gray-700 dark:text-gray-400">Paiement Caisse</button>
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
                            <button id="btn-submit-payment" class="premium-btn w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3">CONFIRMER</button>
                        </div>
                        <div class="lg:col-span-2 space-y-6">
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border dark:border-gray-700">
                                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Etat de Compte</h4>
                                <div class="space-y-4">
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs">Total dû</span><span id="stat-total" class="font-bold">$ 0</span></div>
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs">Payé</span><span id="stat-paid" class="font-bold text-green-500">$ 0</span></div>
                                    <div class="pt-4"><span class="text-[10px] font-bold text-orange-500 uppercase">Reste</span><div id="stat-balance" class="text-3xl font-black text-orange-600">$ 0</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="glass-panel p-6 rounded-3xl"><h3 class="text-sm font-bold text-gray-400 uppercase mb-4">Grille des Frais</h3>
                        <div class="space-y-3">
                            ${inst.finance.fraisScolaires.map(f => `
                                <div class="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex justify-between items-center hover:bg-brand-50">
                                    <span class="text-xs font-bold">${f.classe}</span><span class="text-sm font-black text-brand-600">$${f.montant}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="xl:col-span-3 glass-panel p-8 rounded-[2rem]">
                    <h3 class="text-xl font-extrabold mb-6">Transactions Récentes</h3>
                    <div class="overflow-x-auto"><table class="w-full text-left text-sm">
                        <thead class="text-[10px] text-gray-400 uppercase border-b dark:border-gray-700"><th class="pb-4">Référence</th><th class="pb-4">Elève</th><th class="pb-4">Mode</th><th class="pb-4">Motif</th><th class="pb-4 text-right font-black">Montant</th></thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${inst.finance.recentPayments.map(p => `
                                <tr class="hover:bg-gray-50/50">
                                    <td class="py-5 font-mono text-[10px] text-gray-400">#${p.id}</td>
                                    <td><div class="font-bold">${p.student}</div><div class="text-[10px] text-gray-400">${p.classe || ''}</div></td>
                                    <td><span class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${p.mode === 'Mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gold-100 text-gold-700'}">${p.mode}</span></td>
                                    <td class="text-xs">${p.motif}</td>
                                    <td class="text-right font-black text-brand-600">$${p.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table></div>
                </div>
            </div>
        `;
        initFinanceLogic();
    }

    function initFinanceLogic() {
        const inst = db.institutions[db.ecoleActive];
        const tabM = document.getElementById('tab-momo');
        const tabC = document.getElementById('tab-caisse');
        const fMomo = document.getElementById('momo-fields');
        const fCaisse = document.getElementById('caisse-fields');
        const subBtn = document.getElementById('btn-submit-payment');
        let mode = 'Mobile';

        const updateSummary = (name) => {
            const stu = inst.pedagogie.eleves.find(e => e.nom === name);
            if (!stu) return;
            const fee = inst.finance.fraisScolaires.find(f => f.classe === stu.classe);
            const tot = fee ? fee.montant : 0;
            const bal = tot - stu.paye;
            document.getElementById('stat-total').textContent = `$ ${tot}`;
            document.getElementById('stat-paid').textContent = `$ ${stu.paye}`;
            document.getElementById('stat-balance').textContent = `$ ${bal}`;
            if (mode === 'Caisse') document.getElementById('caisse-class-display').value = stu.classe;
        };

        const sM = document.getElementById('pay-student');
        const sC = document.getElementById('caisse-student');
        if (sM) sM.onchange = (e) => updateSummary(e.target.value);
        if (sC) sC.onchange = (e) => updateSummary(e.target.value);

        if (tabM && tabC) {
            tabM.onclick = () => { mode = 'Mobile'; fMomo.classList.remove('hidden'); fCaisse.classList.add('hidden'); tabM.className = "px-6 py-2.5 text-sm font-bold rounded-xl bg-white dark:bg-gray-700 shadow-md text-brand-600"; tabC.className = "px-6 py-2.5 text-sm font-bold rounded-xl text-gray-500"; };
            tabC.onclick = () => { mode = 'Caisse'; fCaisse.classList.remove('hidden'); fMomo.classList.add('hidden'); tabC.className = "px-6 py-2.5 text-sm font-bold rounded-xl bg-white dark:bg-gray-700 shadow-md text-gold-600"; tabM.className = "px-6 py-2.5 text-sm font-bold rounded-xl text-gray-500"; };
        }

        if (subBtn) {
            subBtn.onclick = () => {
                const name = mode === 'Mobile' ? sM.value : sC.value;
                const amt = parseFloat(document.getElementById('pay-amount').value);
                if (!name || !amt) return alert('Champs requis !');

                const stu = inst.pedagogie.eleves.find(e => e.nom === name);
                subBtn.disabled = true;
                subBtn.innerHTML = 'VALIDATION...';

                setTimeout(() => {
                    const tx = { id: Date.now(), student: name, amount: amt, date: new Date().toLocaleDateString(), motif: 'Paiement', mode, classe: stu.classe };
                    inst.finance.recentPayments.unshift(tx);
                    inst.finance.revenus += amt;
                    stu.paye += amt;
                    saveDb();
                    showProReceipt({ client: name, amount: amt, mode, classe: stu.classe, reste: (inst.finance.fraisScolaires.find(f => f.classe === stu.classe).montant - stu.paye) });
                    renderFinance();
                }, 1000);
            };
        }
    }

    function showProReceipt(data) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('r-client', data.client);
        set('r-amount', `$${data.amount}`);
        set('r-mode', data.mode);
        set('r-id', '#TXN-' + Math.floor(Math.random() * 89999 + 10000));

        const body = document.querySelector('.receipt-body');
        if (body) {
            const extra = document.createElement('div');
            extra.className = 'mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500';
            extra.innerHTML = `<div class="flex justify-between"><span>Classe:</span><b>${data.classe}</b></div><div class="flex justify-between mt-1 text-orange-600"><span>Reste:</span><b>$${data.reste}</b></div>`;
            body.appendChild(extra);
        }

        modal.classList.remove('hidden');
        const qrcEl = document.getElementById('r-qrcode');
        if (qrcEl && window.QRCode) {
            qrcEl.innerHTML = '';
            new QRCode(qrcEl, { text: `TX:${data.client}|AMT:${data.amount}`, width: 80, height: 80 });
        }
    }

    // Modal Close
    const closeBtn = document.getElementById('close-receipt');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('receipt-modal').classList.add('hidden');
    const printBtn = document.getElementById('print-receipt');
    if (printBtn) printBtn.onclick = () => window.print();

    // Default Renders (Empty or Placeholder for now to avoid crashes)
    function renderDashboard() { mainContent.innerHTML = `<div class="p-8"><h1>Dashboard ${db.ecoleActive}</h1><p>Bienvenue Super Admin.</p></div>`; }
    function renderPedagogie() { mainContent.innerHTML = `<div class="p-8"><h1>Pédagogie - ${db.ecoleActive}</h1></div>`; }
    function renderRH() { mainContent.innerHTML = `<div class="p-8"><h1>RH - ${db.ecoleActive}</h1></div>`; }
    function renderCommunication() { mainContent.innerHTML = `<div class="p-8"><h1>Communication - ${db.ecoleActive}</h1></div>`; }
    function renderCoffreFort() { mainContent.innerHTML = `<div class="p-8"><h1>Coffre-fort</h1></div>`; }

    // Pro Features Placeholders
    function initSpeedDial() { }
    function initCommandPalette() { }
    function initLiveActivity() { }
});
