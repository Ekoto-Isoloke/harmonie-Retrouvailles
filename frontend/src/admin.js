import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 10;

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

// Database Logic
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

    const render = () => {
        if (!ui.content) return;
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

    ui.nav.forEach(item => {
        item.onclick = () => {
            ui.nav.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.target;
            render();
        };
    });

    if (ui.theme) ui.theme.onclick = () => { document.documentElement.classList.toggle('dark'); render(); };
    if (ui.logout) ui.logout.onclick = () => { localStorage.clear(); window.location.href = '/login.html'; };

    render();
    initPro();

    function initPro() {
        // Switcher
        const bH = document.getElementById('switch-harmonie');
        const bR = document.getElementById('switch-retrouvailles');
        const upd = () => {
            if (bH && bR) {
                bH.className = db.ecoleActive === 'Harmonie' ? "active-inst" : "inactive-inst";
                bR.className = db.ecoleActive === 'Retrouvailles' ? "active-inst" : "inactive-inst";
            }
        };
        if (bH) bH.onclick = () => { db.ecoleActive = 'Harmonie'; saveDb(); upd(); render(); };
        if (bR) bR.onclick = () => { db.ecoleActive = 'Retrouvailles'; saveDb(); upd(); render(); };
        upd();
    }

    // ==========================================
    // RENDERS
    // ==========================================

    function renderDashboard() {
        const inst = db.institutions[db.ecoleActive];
        ui.content.innerHTML = `
            <div class="mb-10"><h2 class="text-3xl font-black dark:text-white">Vue d'ensemble</h2></div>
            <div id="widgets" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                ${card('Revenus', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-green-500', 'bg-green-50')}
                ${card('Dépenses', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-500', 'bg-red-50')}
                ${card('Effectif', inst.pedagogie.eleves.length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${card('Alertes', inst.comms.smsEnvoyes, 'bell', 'text-purple-500', 'bg-purple-50')}
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-8 rounded-3xl"><h3 class="font-bold mb-6">Flux Revenus</h3><div id="c1" class="h-80"></div></div>
                <div class="glass-panel p-8 rounded-3xl"><h3 class="font-bold mb-6">Répartition Scolaire</h3><div id="c2" class="h-80"></div></div>
            </div>
        `;
        setTimeout(drawCharts, 100);
        if (window.dragula) dragula([document.getElementById('widgets')]);
    }

    function renderFinance() {
        const inst = db.institutions[db.ecoleActive];
        ui.content.innerHTML = `
            <div class="mb-8"><h2 class="text-3xl font-black dark:text-white">Finances & Gestion de Caisse</h2></div>
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <!-- Terminal -->
                <div class="xl:col-span-2 glass-panel p-8 rounded-[2rem] shadow-2xl relative border border-white/20">
                    <div class="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                        <button id="tM" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600">Mobile Money</button>
                        <button id="tC" class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all text-gray-500 hover:text-gray-700">Paiement Caisse</button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div class="lg:col-span-3 space-y-6">
                            
                            <!-- Student Select (Shared) -->
                            <div class="group">
                                <label class="premium-label">Elève / Payeur</label>
                                <select id="pS" class="premium-select">
                                    <option value="" disabled selected>Choisir un élève...</option>
                                    ${inst.pedagogie.eleves.map(e => `<option value="${e.nom}">${e.nom}</option>`).join('')}
                                </select>
                            </div>

                            <!-- Classe Select (NEW: Combobox as requested) -->
                            <div class="group">
                                <label class="premium-label">Classe / Section</label>
                                <select id="pC" class="premium-select">
                                    <option value="" disabled selected>Sélectionner la classe...</option>
                                    ${inst.pedagogie.classes.map(c => `<option value="${c}">${c}</option>`).join('')}
                                </select>
                            </div>

                            <div id="fM" class="grid grid-cols-2 gap-4">
                                <div><label class="premium-label">Opérateur</label><select class="premium-select"><option>M-Pesa</option><option>Airtel</option></select></div>
                                <div><label class="premium-label">Tél</label><input type="text" placeholder="+243..." class="premium-input"></div>
                            </div>

                            <div id="fC" class="hidden">
                                <label class="premium-label">Type de Perception</label>
                                <select id="pM" class="premium-select"><option>Minerval</option><option>Cantine</option><option>Transport</option></select>
                            </div>

                            <div>
                                <label class="premium-label">Montant (USD)</label>
                                <input id="pA" type="number" placeholder="0.00" class="premium-input text-2xl font-black text-brand-600">
                            </div>

                            <button id="pBtn" class="premium-btn w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3">CONFIRMER</button>
                        </div>

                        <div class="lg:col-span-2">
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border dark:border-gray-700 shadow-inner">
                                <h4 class="text-[10px] uppercase tracking-widest mb-6 font-bold text-gray-400">Résumé</h4>
                                <div class="space-y-4">
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span>Total</span><span id="sT" class="font-bold">$ 0</span></div>
                                    <div class="flex justify-between items-end border-b border-dashed dark:border-gray-700 pb-2"><span>Payé</span><span id="sP" class="font-bold text-green-500">$ 0</span></div>
                                    <div class="pt-6"><span class="text-orange-500 font-bold uppercase text-[10px]">Reste</span><div id="sB" class="text-4xl font-black text-orange-600">$ 0</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tarifs -->
                <div class="glass-panel p-6 rounded-3xl">
                    <h3 class="text-xs font-bold uppercase mb-4 text-gray-400">Tarifs Officiels</h3>
                    <div class="space-y-3">
                        ${inst.finance.fraisScolaires.map(f => `
                            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex justify-between">
                                <span class="text-xs font-bold">${f.classe}</span><span class="text-sm font-black text-brand-600">$${f.montant}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Logs -->
                <div class="xl:col-span-3 glass-panel p-8 rounded-[2rem]">
                    <h3 class="font-bold mb-6">Registre des Paiements - ${db.ecoleActive}</h3>
                    <table class="w-full text-left text-sm">
                        <thead class="text-[10px] text-gray-400 uppercase border-b dark:border-gray-700"><th class="pb-4">Référence</th><th>Elève</th><th>Classe</th><th>Mode</th><th class="text-right">Montant</th></thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${inst.finance.recentPayments.map(p => `
                                <tr class="hover:bg-gray-50/50">
                                    <td class="py-5 font-mono text-[10px] text-gray-400">#${p.id}</td>
                                    <td class="font-bold">${p.student}</td>
                                    <td class="text-xs">${p.classe || ''}</td>
                                    <td><span class="px-2 py-1 rounded-full text-[9px] font-black uppercase ${p.mode === 'Mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gold-100 text-gold-700'}">${p.mode}</span></td>
                                    <td class="text-right font-black text-brand-600">$${p.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        initFinance();
    }

    function initFinance() {
        const inst = db.institutions[db.ecoleActive];
        const tM = document.getElementById('tM');
        const tC = document.getElementById('tC');
        const fM = document.getElementById('fM');
        const fC = document.getElementById('fC');
        const pS = document.getElementById('pS');
        const pC = document.getElementById('pC');
        const pBtn = document.getElementById('pBtn');
        let m = 'Mobile';

        const upd = (name) => {
            const s = inst.pedagogie.eleves.find(e => e.nom === name);
            if (!s) return;
            const f = inst.finance.fraisScolaires.find(x => x.classe === s.classe);
            const tot = f ? f.montant : 0;
            const bal = tot - s.paye;

            const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
            set('sT', `$ ${tot}`); set('sP', `$ ${s.paye}`); set('sB', `$ ${bal}`);
            if (pC) pC.value = s.classe; // Auto-select class in combo
        };

        if (pS) pS.onchange = (e) => upd(e.target.value);
        if (pC) pC.onchange = () => {
            // Optional: If user manually changes class, we could recalculate something, 
            // but usually it follows the student's profile.
        };

        if (tM && tC) {
            tM.onclick = () => { m = 'Mobile'; fM.classList.remove('hidden'); fC.classList.add('hidden'); tM.className = "active-tab-momo"; tC.className = "inactive-tab"; };
            tC.onclick = () => { m = 'Caisse'; fC.classList.remove('hidden'); fM.classList.add('hidden'); tC.className = "active-tab-caisse"; tM.className = "inactive-tab"; };
        }

        if (pBtn) {
            pBtn.onclick = () => {
                const name = pS.value;
                const amt = parseFloat(document.getElementById('pA').value);
                const cls = pC.value;
                if (!name || isNaN(amt) || !cls) return alert('Sélectionnez un élève, une classe et un montant.');

                const s = inst.pedagogie.eleves.find(e => e.nom === name);
                pBtn.disabled = true; pBtn.innerHTML = 'VALIDATION...';

                setTimeout(() => {
                    const tx = { id: Date.now().toString().slice(-6), student: name, amount: amt, mode: m, motif: 'Frais', date: new Date().toLocaleDateString(), classe: cls };
                    inst.finance.recentPayments.unshift(tx);
                    inst.finance.revenus += amt;
                    s.paye += amt;
                    saveDb();
                    renderFinance();
                    receipt({ client: name, amount: amt, mode: m, classe: cls, reste: (inst.finance.fraisScolaires.find(f => f.classe === cls).montant - s.paye) });
                }, 1000);
            };
        }
    }

    function receipt(d) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('r-client', d.client); set('r-amount', `$${d.amount}`); set('r-mode', d.mode);
        modal.classList.remove('hidden');
        const b = document.querySelector('.receipt-body');
        if (b) {
            const x = document.createElement('div'); x.className = 'mt-3 pt-3 border-t border-gray-100 text-[10px]';
            x.innerHTML = `<div class="flex justify-between"><span>Solde (Restant)</span><b>$${d.reste}</b></div>`;
            b.appendChild(x);
        }
        const qr = document.getElementById('r-qrcode');
        if (qr && window.QRCode) { qr.innerHTML = ''; new QRCode(qr, { text: `VALID:${d.client}`, width: 80, height: 80 }); }
    }

    // Modal
    const cR = document.getElementById('close-receipt');
    if (cR) cR.onclick = () => document.getElementById('receipt-modal').classList.add('hidden');

    // charts
    function drawCharts() {
        if (!window.ApexCharts) return;
        const isD = document.documentElement.classList.contains('dark');
        const inst = db.institutions[db.ecoleActive];

        new ApexCharts(document.getElementById('c1'), {
            series: [{ name: 'Revenus', data: [30, 40, 35, 50, 49, 100, inst.finance.revenus / 1000] }],
            chart: { type: 'area', height: 320, toolbar: { show: false } },
            colors: ['#22c55e'], stroke: { curve: 'smooth' },
            theme: { mode: isD ? 'dark' : 'light' }
        }).render();

        new ApexCharts(document.getElementById('c2'), {
            series: [40, 30, 20, 10],
            chart: { type: 'donut', height: 320 },
            labels: ['Primaires', 'CTEB', 'Humanités', 'Maternelle'],
            colors: ['#c7882c', '#22c55e', '#3b82f6', '#8b5cf6'],
            theme: { mode: isD ? 'dark' : 'light' }
        }).render();
    }

    function card(t, v, i, c, b) {
        return `<div class="glass-panel p-6 rounded-3xl flex items-center gap-4 hover:translate-y-[-4px] transition-all cursor-move shadow-lg">
            <div class="w-12 h-12 rounded-2xl ${b} ${c} flex items-center justify-center"><i data-lucide="${i}"></i></div>
            <div><p class="text-[10px] font-bold text-gray-400 uppercase">${t}</p><h4 class="text-2xl font-black dark:text-white">${v}</h4></div>
        </div>`;
    }

    // Placeholders
    function renderPedagogie() { ui.content.innerHTML = `<div class="p-8"><h1>Pédagogie - ${db.ecoleActive}</h1></div>`; }
    function renderRH() { ui.content.innerHTML = `<div class="p-8"><h1>RH - ${db.ecoleActive}</h1></div>`; }
    function renderCommunication() { ui.content.innerHTML = `<div class="p-8"><h1>Communication</h1></div>`; }
    function renderCoffreFort() { ui.content.innerHTML = `<div class="p-8"><h1>Coffre-fort</h1></div>`; }
});
