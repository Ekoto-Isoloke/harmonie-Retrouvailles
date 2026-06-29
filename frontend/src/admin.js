import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 17;

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
            { id: 1, nom: 'Admin', prenom: 'Super', role: 'Direction', statut: 'Actif', ecole: 'Harmonie' },
            { id: 2, nom: 'Directeur', prenom: 'Adjoint', role: 'Direction', statut: 'Actif', ecole: 'Retrouvailles' }
        ],
        pointages: [
            { nom: 'Admin Super', date: '2026-06-26', statut: 'Présent', arrivee: '08:00', ecole: 'Harmonie' },
            { nom: 'Directeur Adjoint', date: '2026-06-26', statut: 'Présent', arrivee: '07:45', ecole: 'Retrouvailles' },
            { nom: 'Baya Paul (Prof)', date: '2026-06-26', statut: 'Retard', arrivee: '08:30', ecole: 'Retrouvailles' }
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
        ui.content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-3xl font-black dark:text-white uppercase tracking-tighter">RH & Pointages</h2>
                <p class="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Gestion du personnel</p>
            </div>
            <div class="glass-panel p-10 rounded-[2.5rem] shadow-xl border border-white/20">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="font-black text-xl uppercase tracking-wider">Pointage du jour</h3>
                    <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">Scanner Empreinte/QR</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="text-[10px] text-gray-400 uppercase font-black border-b dark:border-gray-700">
                            <tr><th class="pb-4">Employé</th><th class="pb-4">Arrivée</th><th class="pb-4">Statut</th></tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            ${db.rh.pointages.filter(p => p.ecole === db.ecoleActive).map(p => `
                                <tr>
                                    <td class="py-4 font-bold text-gray-900 dark:text-white">${p.nom}</td>
                                    <td class="py-4 font-mono text-sm">${p.arrivee}</td>
                                    <td class="py-4"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase">${p.statut}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
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
});
