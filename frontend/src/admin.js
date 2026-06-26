import './style.css';

// ==========================================
// ETAT GLOBAL (Mocked Database in LocalStorage)
// ==========================================
const defaultData = {
    ecoleActive: 'Harmonie',
    finance: {
        revenus: 45000,
        depenses: 12000,
        fraisScolaires: [
            { classe: '1ère Primaire', montant: 150, devise: 'USD' },
            { classe: '7ème EB', montant: 200, devise: 'USD' }
        ]
    },
    rh: {
        comptes: [
            { id: 1, nom: 'Kalombo', prenom: 'Jean', role: 'Enseignant', statut: 'Actif', ecole: 'Harmonie' },
            { id: 2, nom: 'Ngalula', prenom: 'Marie', role: 'Parent', statut: 'Actif', ecole: 'Retrouvailles' },
            { id: 3, nom: 'Tshibangu', prenom: 'Paul', role: 'Agent', statut: 'Suspendu', ecole: 'Harmonie' }
        ],
        pointages: [
            { nom: 'Kalombo Jean', date: '2026-06-26', statut: 'Présent', arrivee: '07:15', depart: '14:30' },
            { nom: 'Ilunga Pierre', date: '2026-06-26', statut: 'Absent', arrivee: '--:--', depart: '--:--' }
        ]
    },
    pedagogie: {
        enseignants: ['Kalombo Jean', 'Mutombo Sarah', 'Kabongo David'],
        classes: ['1ère Primaire', '2ème Primaire', '7ème EB', '3ème Humanités Scientifiques'],
        affectations: {} // { classe: [enseignant1, enseignant2] }
    },
    comms: {
        smsEnvoyes: 1245,
        whatsappEnvoyes: 340,
        autoSmsRetard: true,
        autoWaRappel: false
    }
};

// Initialize DB
if (!localStorage.getItem('admin_db')) {
    localStorage.setItem('admin_db', JSON.stringify(defaultData));
}
let db = JSON.parse(localStorage.getItem('admin_db'));

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

    // ==========================================
    // RENDERERS DES MODULES
    // ==========================================

    function renderDashboard() {
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Vue d'ensemble</h2>
                <p class="text-gray-500 text-sm mt-1">Performances globales de l'institution.</p>
            </div>

            <!-- KPIs Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${createKPICard('Revenus Mensuels', `$${db.finance.revenus.toLocaleString()}`, 'trending-up', 'text-brand-500', 'bg-brand-50')}
                ${createKPICard('Dépenses / Paie', `$${db.finance.depenses.toLocaleString()}`, 'trending-down', 'text-red-500', 'bg-red-50')}
                ${createKPICard('Comptes Actifs', db.rh.comptes.length, 'users', 'text-blue-500', 'bg-blue-50')}
                ${createKPICard('Messages Envoyés', db.comms.smsEnvoyes + db.comms.whatsappEnvoyes, 'message-circle', 'text-purple-500', 'bg-purple-50')}
            </div>

            <!-- Charts Area -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Flux Financier (Derniers mois)</h3>
                    <div id="financeChart" class="h-72 w-full"></div>
                </div>
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Démographie par Section</h3>
                    <div id="demoChart" class="h-72 w-full flex justify-center"></div>
                </div>
            </div>
        `;

        setTimeout(initCharts, 100);
    }

    function renderPedagogie() {
        mainContent.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion Pédagogique</h2>
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
                        ${db.pedagogie.enseignants.map(e => `
                            <div class="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded cursor-grab shadow-sm flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">${e.charAt(0)}</div>
                                <span class="text-sm font-medium dark:text-gray-200">${e}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Classes -->
                <div class="col-span-2 grid grid-cols-2 gap-4">
                    ${db.pedagogie.classes.map(c => `
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
            }).on('drop', function(el, target, source, sibling) {
                // Here we would normally save state to DB
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
                <div class="flex gap-2">
                    <select class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none dark:text-gray-200">
                        <option>Tous les rôles</option>
                        <option>Enseignants</option>
                        <option>Parents</option>
                        <option>Agents</option>
                    </select>
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
                        ${db.rh.comptes.map(u => `
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
                ${db.rh.pointages.map(p => `
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
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Finances & Paie</h2>
                <p class="text-gray-500 text-sm mt-1">Smart Accounting, Mobile Money et Calcul de Paie.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Grille Tarifaire -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Grille Tarifaire (Frais Scolaires)</h3>
                    <div class="space-y-3">
                        ${db.finance.fraisScolaires.map(f => `
                            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span class="font-medium text-gray-700 dark:text-gray-300">${f.classe}</span>
                                <span class="font-bold text-gold-600">${f.montant} ${f.devise}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
                        + Ajouter un tarif
                    </button>
                </div>

                <!-- Simulateur Mobile Money & Reçu -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Simulateur Mobile Money</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Réseau</label>
                            <select class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white text-sm">
                                <option>M-Pesa (Vodacom)</option>
                                <option>Airtel Money</option>
                                <option>Orange Money</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Numéro de téléphone</label>
                            <input type="text" value="+243" class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">Montant (USD)</label>
                            <input type="number" placeholder="ex: 50" class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white text-sm">
                        </div>
                        <button id="btn-simulate-pay" class="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2">
                            <i data-lucide="smartphone-nfc" class="w-4 h-4"></i> Lancer le paiement
                        </button>
                    </div>

                    <!-- Zone de reçu QR -->
                    <div id="receipt-area" class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 hidden text-center">
                        <p class="text-sm font-bold text-green-600 mb-3">Paiement validé !</p>
                        <div id="qrcode" class="flex justify-center mb-3 p-2 bg-white rounded inline-block"></div>
                        <p class="text-xs text-gray-500">Scan QR pour vérification d'authenticité</p>
                    </div>
                </div>

                <!-- Calcul de Paie -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-2">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Moteur de Paie & Pénalités</h3>
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                                <th class="pb-2">Enseignant</th>
                                <th class="pb-2">Salaire Base</th>
                                <th class="pb-2">Absences (Jours)</th>
                                <th class="pb-2">Pénalité</th>
                                <th class="pb-2 font-bold">Net à payer</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr class="text-gray-800 dark:text-gray-200">
                                <td class="py-3">Kalombo Jean</td>
                                <td>$300</td>
                                <td class="text-red-500">2</td>
                                <td class="text-red-500">-$20</td>
                                <td class="font-bold text-brand-600 dark:text-brand-400">$280</td>
                            </tr>
                            <tr class="text-gray-800 dark:text-gray-200">
                                <td class="py-3">Mutombo Sarah</td>
                                <td>$300</td>
                                <td class="text-green-500">0</td>
                                <td class="text-gray-400">$0</td>
                                <td class="font-bold text-brand-600 dark:text-brand-400">$300</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            const btn = document.getElementById('btn-simulate-pay');
            if(btn) {
                btn.addEventListener('click', () => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Traitement...';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        document.getElementById('receipt-area').classList.remove('hidden');
                        document.getElementById('qrcode').innerHTML = '';
                        new QRCode(document.getElementById('qrcode'), {
                            text: "Reçu OFFICIEL - TXN-" + Math.floor(Math.random()*100000),
                            width: 100,
                            height: 100
                        });
                        lucide.createIcons();
                    }, 1500);
                });
            }
        }, 100);
    }

    function renderCommunication() {
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Communication Hybride</h2>
                <p class="text-gray-500 text-sm mt-1">SMS Low-Cost et WhatsApp Business API.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Automatisations -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Règles d'Automatisation</h3>
                    
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">Alerte Absence/Retard (SMS)</p>
                            <p class="text-xs text-gray-500 mt-1">Envoi auto aux parents lors d'un pointage manquant.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" ${db.comms.autoSmsRetard ? 'checked' : ''} onchange="updateCommState('autoSmsRetard', this.checked)">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">Rappel Frais (WhatsApp)</p>
                            <p class="text-xs text-gray-500 mt-1">Envoi du PDF du bulletin si solde payé, sinon rappel.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" ${db.comms.autoWaRappel ? 'checked' : ''} onchange="updateCommState('autoWaRappel', this.checked)">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                <!-- Envoi Manuel -->
                <div class="glass-panel p-6 rounded-2xl shadow-sm flex flex-col">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Envoi Manuel Rapide</h3>
                    <div class="flex gap-2 mb-4">
                        <button class="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"><i data-lucide="message-square" class="w-4 h-4 inline mr-1"></i> SMS</button>
                        <button class="flex-1 py-2 rounded-lg bg-green-50 text-green-600 font-medium text-sm border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"><i data-lucide="message-circle" class="w-4 h-4 inline mr-1"></i> WhatsApp</button>
                    </div>
                    <textarea class="w-full flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="Rédigez votre message ici..."></textarea>
                    <button class="mt-4 w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity">
                        Envoyer le message
                    </button>
                </div>

            </div>
        `;
    }

    function renderCoffreFort() {
        mainContent.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Coffre-fort Numérique</h2>
                <p class="text-gray-500 text-sm mt-1">Archivage sécurisé des documents obligatoires.</p>
            </div>
            
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-gray-800/30">
                <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <i data-lucide="upload-cloud" class="w-8 h-8"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Glissez vos fichiers ici</h3>
                <p class="text-sm text-gray-500 mb-6">Extraits de naissance, Bulletins d'origine (PDF, JPG - Max 10MB)</p>
                <button class="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    Parcourir les fichiers
                </button>
            </div>
        `;
    }

    // ==========================================
    // HELPERS & CHARTS
    // ==========================================

    window.updateCommState = function(key, val) {
        db.comms[key] = val;
        saveDb();
    };

    function createKPICard(title, value, icon, iconColor, iconBg) {
        return `
            <div class="glass-panel p-5 rounded-2xl flex items-center gap-4">
                <div class="w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center">
                    <i data-lucide="${icon}"></i>
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">${title}</p>
                    <h4 class="text-2xl font-bold text-gray-900 dark:text-white">${value}</h4>
                </div>
            </div>
        `;
    }

    function initCharts() {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#9ca3af' : '#6b7280';
        
        // Destroy existing instances if any to prevent duplicates on tab switch
        if(window.finChart) window.finChart.destroy();
        if(window.demChart) window.demChart.destroy();

        // Finance Chart
        const finOptions = {
            series: [{ name: 'Revenus', data: [31, 40, 28, 51, 42, 109, 100] }, { name: 'Dépenses', data: [11, 32, 45, 32, 34, 52, 41] }],
            chart: { type: 'area', height: 280, toolbar: { show: false }, background: 'transparent' },
            colors: ['#22c55e', '#ef4444'],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] } },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'], labels: { style: { colors: textColor } } },
            yaxis: { labels: { style: { colors: textColor } } },
            legend: { labels: { colors: textColor } },
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const finEl = document.querySelector("#financeChart");
        if(finEl) {
            window.finChart = new ApexCharts(finEl, finOptions);
            window.finChart.render();
        }

        // Demographic Chart
        const demOptions = {
            series: [44, 55, 13, 43],
            chart: { type: 'donut', height: 280, background: 'transparent' },
            labels: ['Maternelle', 'Primaire', 'CTEB', 'Humanités'],
            colors: ['#c7882c', '#16a34a', '#3b82f6', '#8b5cf6'],
            stroke: { show: false },
            legend: { position: 'bottom', labels: { colors: textColor } },
            theme: { mode: isDark ? 'dark' : 'light' }
        };
        const demEl = document.querySelector("#demoChart");
        if(demEl) {
            window.demChart = new ApexCharts(demEl, demOptions);
            window.demChart.render();
        }
    }
});
