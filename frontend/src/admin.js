import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
// DB VERSION: Increment this to force a reset on user browsers
const DB_VERSION = 6;

const defaultData = {
    version: DB_VERSION,
    ecoleActive: 'Harmonie',
    institutions: {
        Harmonie: {
            finance: {
                revenus: 45000,
                depenses: 12000,
                fraisScolaires: [
                    { classe: '1ère Primaire', montant: 150, devise: 'USD' },
                    { classe: '2ème Primaire', montant: 150, devise: 'USD' },
                    { classe: 'Maternelle', montant: 100, devise: 'USD' }
                ],
                recentPayments: [
                    { id: 'TX-101', student: 'Leki Marc', amount: 150, date: '2026-06-25', motif: 'Frais Juin', mode: 'Mobile' },
                    { id: 'TX-102', student: 'Kabea Sarah', amount: 50, date: '2026-06-26', motif: 'Reliquat', mode: 'Caisse' }
                ]
            },
            pedagogie: {
                enseignants: ['Kalombo Jean', 'Mutombo Sarah'],
                classes: ['Maternelle', '1ère Primaire', '2ème Primaire'],
                eleves: ['Leki Marc', 'Kabea Sarah', 'Mbuyi Paul', 'Ngalula Rose']
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
                    { classe: '7ème EB', montant: 200, devise: 'USD' },
                    { classe: '1ère Humanités', montant: 250, devise: 'USD' }
                ],
                recentPayments: [
                    { id: 'TX-201', student: 'Baya Paul', amount: 100, date: '2026-06-24', motif: 'Inscription', mode: 'Mobile' }
                ]
            },
            pedagogie: {
                enseignants: ['Kabongo David', 'Ilunga Pierre'],
                classes: ['7ème EB', '1ère Humanités'],
                eleves: ['Baya Paul', 'Tshilanda Alice', 'Kasongo Joel']
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
let storedDb = localStorage.getItem('admin_db');
let db;

try {
    db = storedDb ? JSON.parse(storedDb) : defaultData;
    // Migration/Version check: force reset if version mismatch
    if (!db.version || db.version < DB_VERSION || !db.institutions) {
        console.warn('Database version mismatch. Resetting to default schema.');
        db = defaultData;
        localStorage.setItem('admin_db', JSON.stringify(db));
    }
} catch (e) {
    console.error('Database corruption. Resetting.', e);
    db = defaultData;
    localStorage.setItem('admin_db', JSON.stringify(db));
}

const saveDb = () => {
    localStorage.setItem('admin_db', JSON.stringify(db));
};

// ==========================================
// GESTION DU THEME ET DE L'INTERFACE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // Auth Check
    const user = JSON.parse(localStorage.getItem('hr_user'));
    if (!user || (user.role.toLowerCase() !== 'super-admin' && user.role.toLowerCase() !== 'admin')) {
        window.location.href = '/login.html';
        return;
    }
    document.getElementById('admin-name').textContent = `${user.prenom} ${user.nom}`;

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlClass = document.documentElement.classList;
    if (localStorage.theme === 'dark') htmlClass.add('dark');

    themeToggle.addEventListener('click', () => {
        htmlClass.toggle('dark');
        localStorage.theme = htmlClass.contains('dark') ? 'dark' : 'light';
        renderCurrentView(); // Re-render charts for theme
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_user');
        window.location.href = '/login.html';
    });

    // Navigation Routing
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.getElementById('main-content');
    let currentView = 'dashboard';

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard': renderDashboard(); break;
            case 'pedagogie': renderPedagogie(); break;
            case 'rh': renderRH(); break;
            case 'finance': renderFinance(); break;
            case 'communication': renderCommunication(); break;
            case 'coffrefort': renderCoffreFort(); break;
            default: renderDashboard();
        }
        lucide.createIcons();
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.target;
            renderCurrentView();
        });
    });

    // Initial render
    renderCurrentView();
    initProFeatures();

    // ==========================================
    // PRO DASHBOARD FEATURES (New)
    // ==========================================

    function initProFeatures() {
        initSpeedDial();
        initCommandPalette();
        initLiveActivity();
        initDraggableWorkspace();
        initInstitutionSwitcher();
    }

    function initInstitutionSwitcher() {
        const btnHarmonie = document.getElementById('switch-harmonie');
        const btnRetrouvailles = document.getElementById('switch-retrouvailles');

        const updateUI = () => {
            if (db.ecoleActive === 'Harmonie') {
                btnHarmonie.className = "px-3 py-1 rounded-md bg-white shadow-sm text-gray-800 dark:bg-gray-600 dark:text-white transition-all";
                btnRetrouvailles.className = "px-3 py-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all";
            } else {
                btnRetrouvailles.className = "px-3 py-1 rounded-md bg-white shadow-sm text-gray-800 dark:bg-gray-600 dark:text-white transition-all";
                btnHarmonie.className = "px-3 py-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all";
            }
        };

        btnHarmonie.addEventListener('click', () => {
            db.ecoleActive = 'Harmonie';
            saveDb();
            updateUI();
            addLiveActivity('Institution basculée sur C.S. Harmonie', 'info');
            renderCurrentView();
        });

        btnRetrouvailles.addEventListener('click', () => {
            db.ecoleActive = 'Retrouvailles';
            saveDb();
            updateUI();
            addLiveActivity('Institution basculée sur G.S. Retrouvailles', 'info');
            renderCurrentView();
        });

        updateUI();
    }

    function initSpeedDial() {
        const mainBtn = document.getElementById('speed-dial-main');
        const menu = document.getElementById('speed-dial-menu');

        mainBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            setTimeout(() => menu.classList.toggle('show'), 10);
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                handleQuickAction(action);
                menu.classList.remove('show');
                setTimeout(() => menu.classList.add('hidden'), 300);
            });
        });
    }

    function handleQuickAction(action) {
        switch (action) {
            case 'new-payment':
                currentView = 'finance';
                renderCurrentView();
                addLiveActivity('Ouverture du simulateur de paiement', 'info');
                break;
            case 'quick-attendance':
                currentView = 'rh';
                renderCurrentView();
                addLiveActivity('Accès rapide aux pointages', 'info');
                break;
            case 'send-alert':
                currentView = 'communication';
                renderCurrentView();
                addLiveActivity('Préparation d\'une alerte SMS', 'info');
                break;
        }
    }

    function initCommandPalette() {
        const palette = document.getElementById('command-palette');
        const searchInput = document.getElementById('palette-search');
        const box = document.getElementById('palette-box');

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                palette.classList.remove('hidden');
                setTimeout(() => box.classList.add('show'), 10);
                searchInput.focus();
            }
            if (e.key === 'Escape') {
                closePalette();
            }
        });

        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });

        function closePalette() {
            box.classList.remove('show');
            setTimeout(() => palette.classList.add('hidden'), 300);
        }

        searchInput.addEventListener('input', (e) => {
            renderPaletteResults(e.target.value);
        });
    }

    const commandList = [
        { name: 'Payer Frais', role: 'Finance', icon: 'banknote', action: () => { currentView = 'finance'; renderCurrentView(); } },
        { name: 'Gérer RH', role: 'Personnel', icon: 'users', action: () => { currentView = 'rh'; renderCurrentView(); } },
        { name: 'Voir Pedagogie', role: 'Scolaire', icon: 'graduation-cap', action: () => { currentView = 'pedagogie'; renderCurrentView(); } },
        { name: 'Envoyer SMS', role: 'Comms', icon: 'send', action: () => { currentView = 'communication'; renderCurrentView(); } }
    ];

    function renderPaletteResults(query) {
        const resultsEl = document.getElementById('palette-results');
        const filtered = commandList.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

        resultsEl.innerHTML = filtered.map((c, i) => `
            <div class="palette-item flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${i === 0 ? 'active' : ''}" data-idx="${i}">
                <div class="flex items-center gap-3">
                    <i data-lucide="${c.icon}" class="w-4 h-4 text-gray-500"></i>
                    <span class="text-sm font-medium dark:text-gray-200">${c.name}</span>
                </div>
                <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 uppercase">${c.role}</span>
            </div>
        `).join('');

        lucide.createIcons();

        document.querySelectorAll('.palette-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = item.dataset.idx;
                filtered[idx].action();
                document.getElementById('command-palette').click(); // Close
            });
        });
    }

    function initLiveActivity() {
        addLiveActivity('Système Harmonie initialisé', 'success');
        addLiveActivity('Connecté en tant que Super Admin', 'info');

        // Simulate random activity
        setInterval(() => {
            const activities = [
                { msg: 'Pointage: J. Kalombo (07:15)', type: 'info' },
                { msg: 'Nouveau message WhatsApp envoyé', type: 'success' },
                { msg: 'Frais payés par Parent ID #2', type: 'success' }
            ];
            const rand = activities[Math.floor(Math.random() * activities.length)];
            addLiveActivity(rand.msg, rand.type);
        }, 15000);
    }

    function addLiveActivity(msg, type) {
        const feed = document.getElementById('live-feed');
        if (!feed) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const item = document.createElement('div');
        item.className = 'flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 border-l-2 ' +
            (type === 'success' ? 'border-l-green-500' : 'border-l-blue-500');
        item.innerHTML = `
            <div class="flex-1">
                <p class="text-[10px] text-gray-800 dark:text-gray-200 leading-tight">${msg}</p>
                <p class="text-[8px] text-gray-400 mt-0.5">${time}</p>
            </div>
        `;
        feed.prepend(item);
        if (feed.children.length > 5) feed.lastElementChild.remove();
    }

    function initDraggableWorkspace() {
        // Dragula logic for dashboard widgets if needed
    }

    function showProReceipt(data) {
        const modal = document.getElementById('receipt-modal');
        const qrcEl = document.getElementById('r-qrcode');

        document.getElementById('r-date').textContent = new Date().toLocaleDateString();
        document.getElementById('r-id').textContent = '#TXN-' + Math.floor(Math.random() * 90000 + 10000);
        document.getElementById('r-client').textContent = data.client || 'Client Inconnu';
        document.getElementById('r-motif').textContent = data.motif || 'Paiement Manuel';
        document.getElementById('r-amount').textContent = `$${data.amount || '0.00'}`;
        document.getElementById('r-mode').textContent = data.mode || 'N/A';

        modal.classList.remove('hidden');
        qrcEl.innerHTML = '';
        new QRCode(qrcEl, {
            text: `VALID: ${document.getElementById('r-id').textContent} | AMT: ${data.amount} | MODE: ${data.mode}`,
            width: 80, height: 80
        });

        addLiveActivity(`Reçu Pro généré pour ${data.client}`, 'success');
    }

    window.closeReceipt = () => {
        document.getElementById('receipt-modal').classList.add('hidden');
    };

    document.getElementById('close-receipt').addEventListener('click', window.closeReceipt);
    document.getElementById('print-receipt').addEventListener('click', () => window.print());

    // ==========================================
    // RENDERERS DES MODULES
    // ==========================================

    function renderDashboard() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Vue d'ensemble - ${db.ecoleActive}</h2>
                <p class="text-gray-500 text-sm mt-1">Performances globales de l'institution.</p>
            </div>

            <!-- KPIs Cards -->
            <div id="dashboard-widgets" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${createKPICard('Revenus Mensuels', `$${inst.finance.revenus.toLocaleString()}`, 'trending-up', 'text-brand-500', 'bg-brand-50')}
                ${createKPICard('Dépenses / Paie', `$${inst.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-500', 'bg-red-50')}
                ${createKPICard('Comptes Actifs', db.rh.comptes.filter(u => u.ecole === db.ecoleActive).length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${createKPICard('Messages Envoyés', inst.comms.smsEnvoyes + inst.comms.whatsappEnvoyes, 'message-circle', 'text-purple-500', 'bg-purple-50')}
            </div>

            <!-- Charts Area -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass-panel p-6 rounded-2xl shadow-sm border-t-4 border-t-brand-500">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Flux Financier (Derniers mois)</h3>
                    <div id="financeChart" class="h-72 w-full"></div>
                </div>
                <div class="glass-panel p-6 rounded-2xl shadow-sm border-t-4 border-t-gold-500">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Démographie par Section</h3>
                    <div id="demoChart" class="h-72 w-full flex justify-center"></div>
                </div>
            </div>
        `;

        setTimeout(initCharts, 100);
        setTimeout(() => {
            const container = document.getElementById('dashboard-widgets');
            if (container) {
                if (window.dashDrag) window.dashDrag.destroy();
                window.dashDrag = dragula([container]);
            }
        }, 200);
    }

    function renderPedagogie() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion Pédagogique - ${db.ecoleActive}</h2>
                    <p class="text-gray-500 text-sm mt-1">Affectations et Palmarès EPST.</p>
                </div>
                <button class="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                    <i data-lucide="file-output" class="w-4 h-4"></i>
                    Générer Palmarès EPST
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Enseignants Pool -->
                <div class="glass-panel p-4 rounded-xl shadow-sm col-span-1">
                    <h3 class="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Enseignants Disponibles</h3>
                    <div id="pool-enseignants" class="min-h-[200px] flex flex-col gap-2">
                        ${inst.pedagogie.enseignants.map(e => `
                            <div class="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded cursor-grab shadow-sm flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">${e.charAt(0)}</div>
                                <span class="text-sm font-medium dark:text-gray-200">${e}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Classes -->
                <div class="col-span-2 grid grid-cols-2 gap-4">
                    ${inst.pedagogie.classes.map(c => `
                        <div class="glass-panel p-4 rounded-xl shadow-sm">
                            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 bg-gray-100 dark:bg-gray-800 p-2 rounded">${c}</h3>
                            <div class="drag-container min-h-[100px] bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-2 border-2 border-dashed border-gray-200 dark:border-gray-700" data-class="${c}">
                                <!-- Dropped items will appear here -->
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        setTimeout(() => {
            const containers = [document.getElementById('pool-enseignants'), ...document.querySelectorAll('.drag-container')];
            dragula(containers, {
                copy: function (el, source) {
                    return source === document.getElementById('pool-enseignants');
                },
                accepts: function (el, target) {
                    return target !== document.getElementById('pool-enseignants');
                }
            }).on('drop', function (el, target, source, sibling) {
                console.log('Affectation mise à jour');
            });
        }, 100);
    }

    function renderRH() {
        mainContent.innerHTML = `
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ressources Humaines</h2>
                    <p class="text-gray-500 text-sm mt-1">Gestion des comptes et suivi des présences.</p>
                </div>
            </div>

            <div class="glass-panel rounded-2xl shadow-sm overflow-hidden mb-8">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                            <th class="p-4 font-semibold">Nom & Prénom</th>
                            <th class="p-4 font-semibold">Rôle</th>
                            <th class="p-4 font-semibold">Institution</th>
                            <th class="p-4 font-semibold">Statut</th>
                            <th class="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        ${db.rh.comptes.filter(u => u.ecole === db.ecoleActive).map(u => `
                            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                        <div class="font-medium text-gray-800 dark:text-gray-200">${u.nom} ${u.prenom}</div>
                                    </div>
                                </td>
                                <td class="p-4 text-sm text-gray-600 dark:text-gray-300">${u.role}</td>
                                <td class="p-4 text-sm text-gray-600 dark:text-gray-300">${u.ecole}</td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 text-xs font-medium rounded-full ${u.statut === 'Actif' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                                        ${u.statut}
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Modifier</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Pointages du jour (Biométrie)</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${db.rh.pointages.filter(p => p.ecole === db.ecoleActive).map(p => `
                    <div class="glass-panel p-4 rounded-xl border-l-4 ${p.statut === 'Présent' ? 'border-l-green-500' : 'border-l-red-500'}">
                        <p class="font-semibold text-gray-800 dark:text-gray-200">${p.nom}</p>
                        <p class="text-xs text-gray-500 mt-1">Arrivée: ${p.arrivee} | Départ: ${p.depart}</p>
                        <span class="inline-block mt-2 text-xs font-medium ${p.statut === 'Présent' ? 'text-green-600' : 'text-red-600'}">${p.statut}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderFinance() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Finances & Paie - ${db.ecoleActive}</h2>
                <p class="text-gray-500 text-sm mt-1">Encaissement Mobile Money et Paiement en Caisse.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Terminal de Paiement (Switchable) -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                        <button id="tab-momo" class="flex-1 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-brand-600 transition-all">Mobile Money</button>
                        <button id="tab-caisse" class="flex-1 py-2 text-sm font-semibold rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-all">Paiement Caisse</button>
                    </div>

                    <!-- Formulaire Mobile Money -->
                    <div id="form-momo" class="space-y-4">
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Elève concerné</label>
                            <select id="momo-student" class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm">
                                ${inst.pedagogie.eleves.map(e => `<option>${e}</option>`).join('')}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Réseau</label>
                                <select class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm">
                                    <option>M-Pesa</option><option>Airtel Money</option><option>Orange Money</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Téléphone</label>
                                <input type="text" placeholder="+243..." class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Montant (USD)</label>
                            <input id="momo-amount" type="number" placeholder="0.00" class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm font-bold text-brand-600">
                        </div>
                        <button id="btn-pay-momo" class="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2">
                            <i data-lucide="smartphone-nfc" class="w-5 h-5"></i> Lancer l'encaissement
                        </button>
                    </div>

                    <!-- Formulaire Caisse (Hidden initially) -->
                    <div id="form-caisse" class="space-y-4 hidden animate-fade-in">
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Nom de l'élève (Caisse)</label>
                            <select id="caisse-student" class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm">
                                ${inst.pedagogie.eleves.map(e => `<option>${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Type de Paiement</label>
                            <select id="caisse-motif" class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm">
                                <option>Minerval</option><option>Frais d'Examen</option><option>Uniforme</option><option>Autre</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Montant Reçu (Cash)</label>
                            <input id="caisse-amount" type="number" placeholder="0.00" class="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white text-sm font-bold text-gold-600">
                        </div>
                        <button id="btn-pay-caisse" class="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-bold shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2">
                            <i data-lucide="banknote" class="w-5 h-5"></i> Valider & Imprimer Reçu
                        </button>
                    </div>
                </div>

                <!-- Grille Tarifaire -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Grille Tarifaire (Frais Scolaires)</h3>
                    <div class="space-y-3">
                        ${inst.finance.fraisScolaires.map(f => `
                            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span class="font-medium text-gray-700 dark:text-gray-300">${f.classe}</span>
                                <span class="font-bold text-gold-600 text-lg">${f.montant} ${f.devise}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="mt-4 w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all">+ AJOUTER UN TARIF</button>
                </div>

                <!-- Historique des Paiements -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-2">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 underline decoration-brand-500 underline-offset-8">Historique des Transactions - ${db.ecoleActive}</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="text-gray-400 uppercase text-[10px] tracking-widest border-b dark:border-gray-700">
                                    <th class="pb-3 px-2">ID</th>
                                    <th class="pb-3">Elève</th>
                                    <th class="pb-3 text-center">Mode</th>
                                    <th class="pb-3">Motif</th>
                                    <th class="pb-3 font-bold text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                                ${inst.finance.recentPayments.map(p => `
                                    <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td class="py-4 px-2 font-mono text-[10px] text-gray-400">${p.id}</td>
                                        <td class="font-medium text-gray-800 dark:text-gray-200">${p.student}</td>
                                        <td class="text-center">
                                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.mode === 'Mobile' ? 'bg-blue-50 text-blue-600' : 'bg-gold-50 text-gold-600'}">${p.mode || 'N/A'}</span>
                                        </td>
                                        <td class="text-gray-500">${p.motif}</td>
                                        <td class="font-bold text-right text-brand-600">$${p.amount}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        setupFinanceLogic();
    }

    function setupFinanceLogic() {
        const tabMomo = document.getElementById('tab-momo');
        const tabCaisse = document.getElementById('tab-caisse');
        const formMomo = document.getElementById('form-momo');
        const formCaisse = document.getElementById('form-caisse');

        tabMomo.addEventListener('click', () => {
            tabMomo.className = "flex-1 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-brand-600 transition-all";
            tabCaisse.className = "flex-1 py-2 text-sm font-semibold rounded-lg text-gray-500 transition-all";
            formMomo.classList.remove('hidden');
            formCaisse.classList.add('hidden');
        });

        tabCaisse.addEventListener('click', () => {
            tabCaisse.className = "flex-1 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-gold-600 transition-all";
            tabMomo.className = "flex-1 py-2 text-sm font-semibold rounded-lg text-gray-500 transition-all";
            formCaisse.classList.remove('hidden');
            formMomo.classList.add('hidden');
        });

        // Pay MoMo
        const btnMomo = document.getElementById('btn-pay-momo');
        btnMomo.addEventListener('click', () => {
            const amount = document.getElementById('momo-amount').value;
            const student = document.getElementById('momo-student').value;
            if (!amount) return alert('Veuillez entrer un montant');

            btnMomo.disabled = true;
            btnMomo.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Traitement...';
            lucide.createIcons();

            setTimeout(() => {
                const tx = { id: 'TX-' + Math.floor(Math.random() * 899 + 100), student, amount: parseFloat(amount), date: new Date().toISOString().split('T')[0], motif: 'Frais MoMo', mode: 'Mobile' };
                db.institutions[db.ecoleActive].finance.recentPayments.unshift(tx);
                db.institutions[db.ecoleActive].finance.revenus += parseFloat(amount);
                saveDb();
                renderFinance();
                showProReceipt({ client: student, amount, motif: 'Frais via Mobile Money', mode: 'Mobile' });
            }, 2000);
        });

        // Pay Cash
        const btnCaisse = document.getElementById('btn-pay-caisse');
        btnCaisse.addEventListener('click', () => {
            const amount = document.getElementById('caisse-amount').value;
            const student = document.getElementById('caisse-student').value;
            const motif = document.getElementById('caisse-motif').value;
            if (!amount) return alert('Veuillez entrer un montant');

            const tx = { id: 'TX-' + Math.floor(Math.random() * 899 + 100), student, amount: parseFloat(amount), date: new Date().toISOString().split('T')[0], motif, mode: 'Caisse' };
            db.institutions[db.ecoleActive].finance.recentPayments.unshift(tx);
            db.institutions[db.ecoleActive].finance.revenus += parseFloat(amount);
            saveDb();
            renderFinance();
            showProReceipt({ client: student, amount, motif, mode: 'Caisse' });
        });
    }

    function renderCommunication() {
        const inst = db.institutions[db.ecoleActive];
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Communication Hybride - ${db.ecoleActive}</h2>
                <p class="text-gray-500 text-sm mt-1">SMS Low-Cost et WhatsApp Business API.</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Automatisations</h3>
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 text-sm font-medium">
                        <span>Alerte Absence/Retard (SMS)</span>
                        <input type="checkbox" ${db.commsGlobal.autoSmsRetard ? 'checked' : ''} onchange="updateCommState('autoSmsRetard', this.checked)">
                    </div>
                </div>
            </div>
        `;
    }

    function renderCoffreFort() {
        mainContent.innerHTML = `
            <div class="mb-8"><h2 class="text-2xl font-bold dark:text-white">Coffre-fort</h2></div>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center rounded-2xl">
                <i data-lucide="upload-cloud" class="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                <p class="text-gray-500">Uploadez les documents obligatoires ici</p>
            </div>
        `;
    }

    window.updateCommState = function (key, val) {
        db.commsGlobal[key] = val;
        saveDb();
    };

    function createKPICard(title, value, icon, iconColor, iconBg) {
        return `
            <div class="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-move">
                <div class="w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center">
                    <i data-lucide="${icon}"></i>
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">${title}</p>
                    <h4 class="text-xl font-black text-gray-900 dark:text-white">${value}</h4>
                </div>
            </div>
        `;
    }

    function initCharts() {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#9ca3af' : '#6b7280';
        if (window.finChart) window.finChart.destroy();
        if (window.demChart) window.demChart.destroy();
        const finData = db.ecoleActive === 'Harmonie'
            ? { rev: [31, 40, 28, 51, 42, 109, 100], dep: [11, 32, 45, 32, 34, 52, 41] }
            : { rev: [20, 30, 25, 40, 35, 80, 70], dep: [5, 15, 20, 15, 18, 30, 25] };
        const finOptions = {
            series: [{ name: 'Revenus', data: finData.rev }, { name: 'Dépenses', data: finData.dep }],
            chart: { type: 'area', height: 280, toolbar: { show: false }, background: 'transparent' },
            colors: ['#22c55e', '#ef4444'],
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'], labels: { style: { colors: textColor } } },
            yaxis: { labels: { style: { colors: textColor } } },
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const finEl = document.querySelector("#financeChart");
        if (finEl) { window.finChart = new ApexCharts(finEl, finOptions); window.finChart.render(); }
        const demOptions = {
            series: [44, 55, 13, 43],
            chart: { type: 'donut', height: 280, background: 'transparent' },
            labels: ['Maternelle', 'Primaire', 'CTEB', 'Humanités'],
            colors: ['#c7882c', '#16a34a', '#3b82f6', '#8b5cf6'],
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const demEl = document.querySelector("#demoChart");
        if (demEl) { window.demChart = new ApexCharts(demEl, demOptions); window.demChart.render(); }
    }
});
