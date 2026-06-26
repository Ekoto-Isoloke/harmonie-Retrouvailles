import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 13;

const defaultData = {
    version: DB_VERSION,
    ecoleActive: 'Harmonie',
    institutions: {
        Harmonie: {
            finance: {
                revenus: 45000,
                depenses: 12000,
                fraisScolaires: [
                    { classe: '1ère Maternelle', montant: 450 }, { classe: '2ème Maternelle', montant: 450 }, { classe: '3ème Maternelle', montant: 450 },
                    { classe: '1ère Primaire', montant: 600 }, { classe: '2ème Primaire', montant: 600 }, { classe: '3ème Primaire', montant: 600 },
                    { classe: '4ème Primaire', montant: 600 }, { classe: '5ème Primaire', montant: 600 }, { classe: '6ème Primaire', montant: 600 }
                ],
                recentPayments: [
                    { id: '101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Minerval', mode: 'Mobile', classe: '1ère Primaire' }
                ]
            },
            pedagogie: {
                classes: ['1ère Maternelle', '2ème Maternelle', '3ème Maternelle', '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'],
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
                    { classe: '7ème EB', montant: 850 }, { classe: '8ème EB', montant: 850 },
                    { classe: '1ère Humanités', montant: 1200 }, { classe: '2ème Humanités', montant: 1200 },
                    { classe: '3ème Humanités', montant: 1200 }, { classe: '4ème Humanités', montant: 1200 }
                ],
                recentPayments: [
                    { id: '201', student: 'Baya Paul', amount: 100, date: '2026-06-24', motif: 'Minerval', mode: 'Caisse', classe: '7ème EB' }
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
            comms: { smsEnvoyes: 450, whatsappEnvoyes: 150 }
        }
    },
    rh: {
        comptes: [{ id: 1, nom: 'Admin', prenom: 'Super', role: 'Direction', statut: 'Actif', ecole: 'Harmonie' }],
        pointages: [{ nom: 'Admin Super', date: '2026-06-26', statut: 'Présent', arrivee: '08:00', ecole: 'Harmonie' }]
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
                                        <label class="premium-label">Section *</label>
                                        <select id="secSel" class="premium-select">
                                            <option value="" selected>Choisir Section...</option>
                                            ${hasSec ? inst.pedagogie.sections.map(s => `<option value="${s}">${s}</option>`).join('') : ''}
                                        </select>
                                    </div>
                                </div>
                                <div id="boxOption" class="hidden">
                                    <label class="premium-label">Option / Filière *</label>
                                    <select id="optSel" class="premium-select">
                                        <option value="" selected>Choisir Option...</option>
                                        ${hasSec ? inst.pedagogie.options.map(o => `<option value="${o}">${o}</option>`).join('') : ''}
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
                                <label class="premium-label">Type de Perception (Motif)</label>
                                <select id="motiveSel" class="premium-select"><option>Minerval</option><option>Inscription</option><option>Frais Divers</option></select>
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

                <!-- RIGHT SIDE: Tarifs -->
                <div class="glass-panel p-8 rounded-[2.5rem]"><h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Tarification Officielle</h3>
                    <div class="space-y-4">
                        ${inst.finance.fraisScolaires.slice(0, 8).map(f => `
                            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex justify-between items-center hover:bg-brand-50 transition-all cursor-pointer">
                                <span class="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase">${f.classe}</span>
                                <span class="text-lg font-black text-brand-600">$${f.montant}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- HISTORY -->
                <div class="xl:col-span-3 glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/10">
                    <h3 class="font-black text-2xl uppercase tracking-tighter mb-10">Historique des Flux Financiers</h3>
                    <div class="overflow-x-auto"><table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b dark:border-gray-700 opacity-50"><th class="pb-6">ID Transaction</th><th>Élève</th><th>Classe / Filière</th><th>Mode</th><th class="text-right">Montant (USD)</th><th class="text-right px-4">Action</th></thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                            ${inst.finance.recentPayments.map(p => `
                                <tr class="hover:bg-gray-50/10">
                                    <td class="py-6 font-mono text-[11px] text-gray-400">#${p.id}</td>
                                    <td><div class="font-bold text-gray-900 dark:text-white">${p.student}</div><div class="text-[10px] text-gray-400">${p.date}</div></td>
                                    <td><div class="text-xs font-bold text-gray-700 dark:text-gray-300">${p.classe}</div><div class="text-[9px] text-gray-400 uppercase font-black">${p.option || (p.section || 'Tronc Commun')}</div></td>
                                    <td><span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm ${p.mode === 'Mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gold-100 text-gold-700'}">${p.mode}</span></td>
                                    <td class="text-right font-black text-brand-600 text-2xl font-display">$${p.amount}</td>
                                    <td class="text-right px-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><i data-lucide="printer" class="w-4 h-4 text-gray-400"></i></button></td>
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
        const tM = document.getElementById('tabM'), tC = document.getElementById('tabC');
        const bM = document.getElementById('mFields'), bC = document.getElementById('cFields');
        const sS = document.getElementById('stdSel'), sC = document.getElementById('clsSel');
        const sSec = document.getElementById('secSel'), sOpt = document.getElementById('optSel');
        const bSec = document.getElementById('boxSection'), bOpt = document.getElementById('boxOption');
        const vBtn = document.getElementById('valBtn');
        let mode = 'Mobile';

        const updateSummary = () => {
            const stu = inst.pedagogie.eleves.find(e => e.nom === sS.value);
            if (!stu) return;
            const fee = inst.finance.fraisScolaires.find(f => f.classe === stu.classe);
            if (fee) {
                document.getElementById('txtT').textContent = `$ ${fee.montant}`;
                document.getElementById('txtP').textContent = `$ ${stu.paye}`;
                document.getElementById('txtB').textContent = `$ ${fee.montant - stu.paye}`;
            }
            if (sC) sC.value = stu.classe;
            if (sSec && stu.section) sSec.value = stu.section;
            if (sOpt && stu.option) sOpt.value = stu.option;
            toggleAcademicFields(stu.classe);
        };

        const toggleAcademicFields = (cls) => {
            if (db.ecoleActive === 'Retrouvailles' && cls && cls.includes('Humanités')) {
                bSec?.classList.remove('hidden'); bOpt?.classList.remove('hidden');
            } else {
                bSec?.classList.add('hidden'); bOpt?.classList.add('hidden');
            }
        };

        if (sS) sS.onchange = updateSummary;
        if (sC) sC.onchange = (e) => toggleAcademicFields(e.target.value);

        if (tM && tC) {
            tM.onclick = () => { mode = 'Mobile'; bM.classList.remove('hidden'); bC.classList.add('hidden'); tM.className = 'active-tab-momo'; tC.className = 'inactive-tab'; };
            tC.onclick = () => { mode = 'Caisse'; bC.classList.remove('hidden'); bM.classList.add('hidden'); tC.className = 'active-tab-caisse'; tM.className = 'inactive-tab'; };
        }

        if (vBtn) {
            vBtn.onclick = () => {
                const name = sS.value, amt = parseFloat(document.getElementById('amtInp').value), cls = sC.value;
                if (!name || isNaN(amt) || !cls) return alert('Détails de paiement requis !');

                const stu = inst.pedagogie.eleves.find(e => e.nom === name);
                vBtn.disabled = true; vBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-5 h-5"></i>';
                lucide.createIcons();

                setTimeout(() => {
                    const tx = { id: Math.floor(Math.random() * 9000 + 1000), student: name, amount: amt, mode, date: new Date().toLocaleDateString(), classe: cls, section: sSec?.value, option: sOpt?.value };
                    inst.finance.recentPayments.unshift(tx);
                    inst.finance.revenus += amt; stu.paye += amt;
                    saveDb(); renderView();
                    showReceipt({ ...tx, reste: (inst.finance.fraisScolaires.find(f => f.classe === cls)?.montant - stu.paye || 0) });
                }, 1500);
            };
        }
    }

    function showReceipt(d) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        document.getElementById('r-client').textContent = d.student;
        document.getElementById('r-amount').textContent = `$${d.amount}`;
        document.getElementById('r-mode').textContent = d.mode;
        const body = document.querySelector('.receipt-body');
        if (body) {
            const div = document.createElement('div'); div.className = 'mt-3 pt-3 border-t border-gray-100 text-[10px] space-y-1 uppercase font-bold text-gray-700';
            div.innerHTML = `<div>${d.classe} ${d.section ? `| ${d.section}` : ''} ${d.option ? `| ${d.option}` : ''}</div><div class="text-orange-600">Reste: $${d.reste}</div>`;
            body.appendChild(div);
        }
        const qr = document.getElementById('r-qrcode');
        if (qr && window.QRCode) { qr.innerHTML = ''; new QRCode(qr, { text: `OK:${d.student}`, width: 80, height: 80 }); }
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

    function renderPedagogie() { ui.content.innerHTML = '<div class="p-10"><h2>Module Pédagogique</h2></div>'; }
    function renderRH() { ui.content.innerHTML = '<div class="p-10"><h2>Ressources Humaines</h2></div>'; }
    function renderCommunication() { ui.content.innerHTML = '<div class="p-10"><h2>SMS & Communication</h2></div>'; }
    function renderCoffreFort() { ui.content.innerHTML = '<div class="p-10"><h2>Coffre-fort</h2></div>'; }
});
