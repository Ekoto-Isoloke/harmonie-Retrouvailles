import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 12;

const defaultData = {
    version: DB_VERSION,
    ecoleActive: 'Harmonie',
    institutions: {
        Harmonie: {
            finance: {
                revenus: 45000,
                depenses: 12000,
                fraisScolaires: [
                    { classe: '1ère Maternelle', montant: 450 },
                    { classe: '2ème Maternelle', montant: 450 },
                    { classe: '3ème Maternelle', montant: 450 },
                    { classe: '1ère Primaire', montant: 600 },
                    { classe: '2ème Primaire', montant: 600 },
                    { classe: '3ème Primaire', montant: 600 },
                    { classe: '4ème Primaire', montant: 600 },
                    { classe: '5ème Primaire', montant: 600 },
                    { classe: '6ème Primaire', montant: 600 }
                ],
                recentPayments: [
                    { id: '101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Minerval', mode: 'Mobile', classe: '1ère Primaire' }
                ]
            },
            pedagogie: {
                classes: [
                    '1ère Maternelle', '2ème Maternelle', '3ème Maternelle',
                    '1ère Primaire', '2ème Primaire', '3ème Primaire',
                    '4ème Primaire', '5ème Primaire', '6ème Primaire'
                ],
                eleves: [
                    { nom: 'Leki Marc', classe: '1ère Primaire', paye: 150 },
                    { nom: 'Kabea Sarah', classe: '1ère Maternelle', paye: 400 }
                ]
            },
            comms: { smsEnvoyes: 800, whatsappEnvoyes: 200 }
        },
        Retrouvailles: {
            finance: {
                revenus: 25000,
                depenses: 8000,
                fraisScolaires: [
                    { classe: '7ème EB', montant: 850 },
                    { classe: '8ème EB', montant: 850 },
                    { classe: '1ère Humanités', montant: 1200 },
                    { classe: '2ème Humanités', montant: 1200 },
                    { classe: '3ème Humanités', montant: 1200 },
                    { classe: '4ème Humanités', montant: 1200 }
                ],
                recentPayments: [
                    { id: '201', student: 'Baya Paul', amount: 100, date: '2026-06-24', motif: 'Minerval', mode: 'Mobile', classe: '7ème EB' }
                ]
            },
            pedagogie: {
                classes: ['7ème EB', '8ème EB', '1ère Humanités', '2ème Humanités', '3ème Humanités', '4ème Humanités'],
                sections: ['Technique', 'Scientifique', 'Littéraire', 'Pédagogique'],
                options: ['Latin-Philo', 'Chimie-Biologie', 'Math-Physique', 'Commerciale & Gestion', 'Secrétariat', 'Electricité'],
                eleves: [
                    { nom: 'Baya Paul', classe: '7ème EB', paye: 100 },
                    { nom: 'Tshilanda Alice', classe: '1ère Humanités', paye: 0, section: 'Scientifique', option: 'Chimie-Biologie' }
                ]
            },
            comms: { smsEnvoyes: 445, whatsappEnvoyes: 140 }
        }
    },
    rh: {
        comptes: [{ id: 1, nom: 'Kalombo', prenom: 'Jean', role: 'Enseignant', statut: 'Actif', ecole: 'Harmonie' }],
        pointages: [{ nom: 'Kalombo Jean', date: '2026-06-26', statut: 'Présent', arrivee: '07:15', ecole: 'Harmonie' }]
    },
    commsGlobal: { autoSmsRetard: true, autoWaRappel: false }
};

// DB Logic
let db;
try {
    let s = localStorage.getItem('admin_db');
    db = s ? JSON.parse(s) : defaultData;
    if (!db.version || db.version < DB_VERSION) { db = defaultData; localStorage.setItem('admin_db', JSON.stringify(db)); }
} catch (e) { db = defaultData; }
const saveDb = () => localStorage.setItem('admin_db', JSON.stringify(db));

// ==========================================
// UI ENGINE
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

    let view = 'dashboard';

    const render = () => {
        if (!ui.content) return;
        switch (view) {
            case 'dashboard': dash(); break;
            case 'pedagogie': peda(); break;
            case 'rh': rh(); break;
            case 'finance': finance(); break;
            case 'communication': comm(); break;
            default: ui.content.innerHTML = '<div class="p-20 text-center">En cours de développement...</div>';
        }
        if (window.lucide) lucide.createIcons();
    };

    ui.nav.forEach(n => n.onclick = () => { ui.nav.forEach(x => x.classList.remove('active')); n.classList.add('active'); view = n.dataset.target; render(); });
    if (ui.theme) ui.theme.onclick = () => { document.documentElement.classList.toggle('dark'); render(); };
    if (ui.logout) ui.logout.onclick = () => { localStorage.clear(); window.location.href = '/login.html'; };

    render();
    initSwitcher();

    function initSwitcher() {
        const h = document.getElementById('switch-harmonie'), r = document.getElementById('switch-retrouvailles');
        const u = () => {
            if (h && r) {
                h.className = db.ecoleActive === 'Harmonie' ? 'active-inst' : 'inactive-inst';
                r.className = db.ecoleActive === 'Retrouvailles' ? 'active-inst' : 'inactive-inst';
            }
        };
        if (h) h.onclick = () => { db.ecoleActive = 'Harmonie'; saveDb(); u(); render(); };
        if (r) r.onclick = () => { db.ecoleActive = 'Retrouvailles'; saveDb(); u(); render(); };
        u();
    }

    // ==========================================
    // MODULE: DASHBOARD
    // ==========================================
    function dash() {
        const inst = db.institutions[db.ecoleActive];
        ui.content.innerHTML = `
            <div class="mb-10"><h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Performance ERP</h2></div>
            <div id="w" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                ${kpi('Recettes', `$${inst.finance.revenus.toLocaleString()}`, 'dollar-sign', 'text-green-500', 'bg-green-50')}
                ${kpi('Dépenses', `$${inst.finance.depenses.toLocaleString()}`, 'shopping-cart', 'text-red-500', 'bg-red-50')}
                ${kpi('Elèves', inst.pedagogie.eleves.length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${kpi('Staff', db.rh.comptes.length, 'shield', 'text-amber-500', 'bg-amber-50')}
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-8 rounded-3xl"><h3 class="font-bold mb-6">Trésorerie Actuelle</h3><div id="c1" class="h-80"></div></div>
                <div class="glass-panel p-8 rounded-3xl"><h3 class="font-bold mb-6">Analyse Scolaire</h3><div id="c2" class="h-80"></div></div>
            </div>
        `;
        setTimeout(charts, 100);
    }

    // ==========================================
    // MODULE: FINANCE (THE MEAT)
    // ==========================================
    function finance() {
        const inst = db.institutions[db.ecoleActive];
        const isHum = db.ecoleActive === 'Retrouvailles';

        ui.content.innerHTML = `
            <div class="mb-8"><h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">Caisse & Terminaux</h2></div>
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <!-- Main Form -->
                <div class="xl:col-span-2 glass-panel p-10 rounded-[2.5rem] shadow-2xl relative border border-white/20">
                    <div class="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl mb-10 w-fit">
                        <button id="tM" class="px-8 py-2.5 text-sm font-bold rounded-xl transition-all bg-white dark:bg-gray-700 shadow-md text-brand-600">Mobile Money</button>
                        <button id="tC" class="px-8 py-2.5 text-sm font-bold rounded-xl transition-all text-gray-500">Caisse (Cash)</button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div class="lg:col-span-3 space-y-6">
                            
                            <div><label class="premium-label">Nom de l'élève *</label>
                                <select id="sS" class="premium-select">
                                    <option value="" disabled selected>Choisir un élève...</option>
                                    ${inst.pedagogie.eleves.map(e => `<option value="${e.nom}">${e.nom}</option>`).join('')}
                                </select>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label class="premium-label">Classe Sollicitée *</label>
                                    <select id="sC" class="premium-select">
                                        <option value="" disabled selected>Sélectionner...</option>
                                        ${inst.pedagogie.classes.map(c => `<option value="${c}">${c}</option>`).join('')}
                                    </select>
                                </div>
                                <div id="boxSection" class="${isHum ? '' : 'hidden'} font-medium">
                                    <label class="premium-label">Section / Option *</label>
                                    <select id="sSection" class="premium-select">
                                        <option value="" selected>Tronc Commun / N/A</option>
                                        ${isHum ? inst.pedagogie.sections.map(s => `<option value="${s}">${s}</option>`).join('') : ''}
                                    </select>
                                </div>
                            </div>

                            <div id="boxOption" class="hidden">
                                <label class="premium-label">Option Spécifique *</label>
                                <select id="sOption" class="premium-select">
                                    <option value="" selected>Choisir l'option...</option>
                                    ${isHum ? inst.pedagogie.options.map(o => `<option value="${o}">${o}</option>`).join('') : ''}
                                </select>
                            </div>

                            <div id="mFields" class="grid grid-cols-2 gap-4">
                                <div><label class="premium-label">Opérateur</label><select class="premium-select"><option>M-Pesa</option><option>Airtel</option></select></div>
                                <div><label class="premium-label">Tél</label><input type="text" placeholder="+243..." class="premium-input"></div>
                            </div>

                            <div id="cFields" class="hidden"><label class="premium-label">Motif</label><select id="sMotif" class="premium-select"><option>Minerval</option><option>Inscription</option></select></div>

                            <div><label class="premium-label text-brand-600">Montant Reçu (USD)</label><input id="vA" type="number" placeholder="0.00" class="premium-input text-3xl font-black text-brand-600"></div>

                            <button id="vBtn" class="premium-btn w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3">VALIDER LE PAIEMENT</button>
                        </div>

                        <div class="lg:col-span-2">
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] p-8 border dark:border-gray-700 shadow-inner h-full flex flex-col justify-between">
                                <div><h4 class="text-[10px] uppercase font-black text-gray-400 mb-6">Fiche de Solde</h4>
                                <div class="space-y-4">
                                    <div class="flex justify-between border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs">Total Dû</span><span id="xT" class="font-bold">$ 0</span></div>
                                    <div class="flex justify-between border-b border-dashed dark:border-gray-700 pb-2"><span class="text-xs">Réglé</span><span id="xP" class="font-bold text-green-500">$ 0</span></div>
                                </div></div>
                                <div class="pt-8"><span class="text-orange-500 font-black text-[10px] uppercase">Reste</span><div id="xB" class="text-5xl font-black text-orange-600">$ 0</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History -->
                <div class="xl:col-span-3 glass-panel p-8 rounded-[2.5rem]">
                    <h3 class="font-black mb-8 uppercase text-lg">Derniers Encaissements - ${db.ecoleActive}</h3>
                    <div class="overflow-x-auto"><table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase tracking-widest border-b dark:border-gray-700"><th class="pb-4">N°</th><th>Elève</th><th>Détails (Classe/Option)</th><th>Mode</th><th class="text-right">Montant</th></thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${inst.finance.recentPayments.map(p => `
                                <tr>
                                    <td class="py-6 font-mono text-[10px]">#${p.id}</td>
                                    <td class="font-bold">${p.student}</td>
                                    <td><div class="text-xs font-bold text-gray-700 dark:text-gray-300">${p.classe}</div><div class="text-[9px] text-gray-400 font-bold uppercase">${p.option || (p.section || '')}</div></td>
                                    <td><span class="px-3 py-1 rounded-full text-[9px] font-black uppercase ${p.mode === 'Mobile' ? 'bg-blue-50 text-blue-600' : 'bg-gold-50 text-gold-700'}">${p.mode}</span></td>
                                    <td class="text-right font-black text-brand-600 text-xl font-display">$${p.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table></div>
                </div>
            </div>
        `;
        initFinance();
    }

    function initFinance() {
        const inst = db.institutions[db.ecoleActive];
        const tM = document.getElementById('tM'), tC = document.getElementById('tC');
        const bM = document.getElementById('mFields'), bC = document.getElementById('cFields');
        const sS = document.getElementById('sS'), sC = document.getElementById('sC');
        const sSec = document.getElementById('sSection'), sOpt = document.getElementById('sOption');
        const bSec = document.getElementById('boxSection'), bOpt = document.getElementById('boxOption');
        const btn = document.getElementById('vBtn');
        let m = 'Mobile';

        const u = () => {
            const stu = inst.pedagogie.eleves.find(e => e.nom === sS.value);
            if (!stu) return;
            const fee = inst.finance.fraisScolaires.find(f => f.classe === stu.classe);
            const tot = fee ? fee.montant : 0;
            const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
            set('xT', `$ ${tot}`); set('xP', `$ ${stu.paye}`); set('xB', `$ ${tot - stu.paye}`);
            if (sC) sC.value = stu.classe;
            if (sSec && stu.section) sSec.value = stu.section;
            if (sOpt && stu.option) sOpt.value = stu.option;
            toggleSec(stu.classe);
        };

        const toggleSec = (cls) => {
            if (db.ecoleActive === 'Retrouvailles' && cls && cls.includes('Humanités')) {
                if (bSec) bSec.classList.remove('hidden');
                if (bOpt) bOpt.classList.remove('hidden');
            } else {
                if (bSec) bSec.classList.add('hidden');
                if (bOpt) bOpt.classList.add('hidden');
            }
        };

        if (sS) sS.onchange = u;
        if (sC) sC.onchange = (e) => toggleSec(e.target.value);

        if (tM && tC) {
            tM.onclick = () => { m = 'Mobile'; bM.classList.remove('hidden'); bC.classList.add('hidden'); tM.className = 'active-tab-momo'; tC.className = 'inactive-tab'; };
            tC.onclick = () => { m = 'Caisse'; bC.classList.remove('hidden'); bM.classList.remove('hidden'); tC.className = 'active-tab-caisse'; tM.className = 'inactive-tab'; };
        }

        if (btn) {
            btn.onclick = () => {
                const name = sS.value, amt = parseFloat(document.getElementById('vA').value);
                if (!name || isNaN(amt)) return alert('Saisie invalide.');
                const stu = inst.pedagogie.eleves.find(e => e.nom === name);
                btn.disabled = true; btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i>';
                setTimeout(() => {
                    const tx = { id: Date.now().toString().slice(-5), student: name, amount: amt, mode: m, date: new Date().toLocaleDateString(), classe: sC.value, section: sSec?.value, option: sOpt?.value };
                    inst.finance.recentPayments.unshift(tx);
                    inst.finance.revenus += amt; stu.paye += amt;
                    saveDb(); render(); pop({ ...tx, reste: (inst.finance.fraisScolaires.find(f => f.classe === sC.value)?.montant - stu.paye || 0) });
                }, 1000);
            };
        }
    }

    function pop(d) {
        const m = document.getElementById('receipt-modal');
        if (!m) return;
        m.classList.remove('hidden');
        document.getElementById('r-client').textContent = d.student;
        document.getElementById('r-amount').textContent = `$${d.amount}`;
        document.getElementById('r-mode').textContent = d.mode;
        const b = document.querySelector('.receipt-body');
        if (b) {
            const x = document.createElement('div'); x.className = 'mt-3 pt-3 border-t border-gray-100 text-[10px] space-y-1';
            x.innerHTML = `<div><b>${d.classe}</b> ${d.section ? `| ${d.section}` : ''} ${d.option ? `| ${d.option}` : ''}</div><div class="text-orange-600">Reste: <b>$${d.reste}</b></div>`;
            b.appendChild(x);
        }
        const qr = document.getElementById('r-qrcode');
        if (qr && window.QRCode) { qr.innerHTML = ''; new QRCode(qr, { text: `TX:${d.id}`, width: 80, height: 80 }); }
    }

    // Modal
    const cR = document.getElementById('close-receipt');
    if (cR) cR.onclick = () => document.getElementById('receipt-modal').classList.add('hidden');
    const pR = document.getElementById('print-receipt');
    if (pR) pR.onclick = () => window.print();

    // Helpers
    function charts() {
        if (!window.ApexCharts) return;
        const inst = db.institutions[db.ecoleActive], isD = document.documentElement.classList.contains('dark');
        new ApexCharts(document.getElementById('c1'), { series: [{ name: 'Recettes', data: [20, 30, 40, 25, 60, inst.finance.revenus / 1000] }], chart: { type: 'area', height: 320, toolbar: { show: false } }, theme: { mode: isD ? 'dark' : 'light' } }).render();
        new ApexCharts(document.getElementById('c2'), { series: [40, 40, 20], chart: { type: 'donut', height: 320 }, labels: ['Maternelle', 'Primaire', 'Secondaire'], theme: { mode: isD ? 'dark' : 'light' } }).render();
    }
    function kpi(t, v, icon, color, bg) {
        return `<div class="glass-panel p-6 rounded-3xl flex items-center gap-4 hover:translate-y-[-4px] transition-all shadow-lg">
            <div class="w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center"><i data-lucide="${icon}"></i></div>
            <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">${t}</p><h4 class="text-2xl font-black dark:text-white">${v}</h4></div>
        </div>`;
    }

    // Placeholders
    function peda() { mainContent.innerHTML = '<div class="p-10"><h2>Pédagogie</h2></div>'; }
    function rh() { mainContent.innerHTML = '<div class="p-10"><h2>Ressources Humaines</h2></div>'; }
    function comm() { mainContent.innerHTML = '<div class="p-10"><h2>Communication</h2></div>'; }
});
