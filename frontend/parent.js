import './style.css';

// ===== Auth verification =====
const token = localStorage.getItem('hr_token');
const userStr = localStorage.getItem('hr_user');

if (!token || !userStr) {
  window.location.href = '/login.html';
}

const user = JSON.parse(userStr);
// Update sidebar name
const sidebarNameElement = document.querySelector('aside .p-6 p.font-semibold');
if (sidebarNameElement) {
    sidebarNameElement.textContent = `Famille ${user.nom}`;
}
const sidebarIdElement = document.querySelector('aside .p-6 p.text-xs');
if (sidebarIdElement) {
    sidebarIdElement.textContent = `ID: PAR-${user.id}`;
}

// --- Simulation de la vue unifiée "Parents" avec données hors-ligne ---

const enfantsMockData = [
  {
    id: 1,
    nom: 'MUKENDI',
    prenom: 'Sarah',
    ecole: 'Harmonie',
    classe: '6ème Primaire',
    color: 'primary',
    active: true
  },
  {
    id: 2,
    nom: 'MUKENDI',
    prenom: 'David',
    ecole: 'Retrouvailles',
    classe: '3ème Humanités Scientifiques',
    color: 'secondary',
    active: false
  }
];

// Rendu des enfants dans l'entête
const enfantsContainer = document.getElementById('enfants-container');

function renderEnfants() {
  enfantsContainer.innerHTML = '';
  enfantsMockData.forEach(enfant => {
    const card = document.createElement('div');
    const bgClass = enfant.active ? `bg-${enfant.color}-500 text-white shadow-lg shadow-${enfant.color}-500/30` : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
    const textClass = enfant.active ? 'text-white/80' : 'text-slate-500';
    
    card.className = `min-w-[240px] p-4 rounded-2xl cursor-pointer transition-all duration-300 transform ${enfant.active ? '-translate-y-1' : ''} ${bgClass}`;
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold">${enfant.prenom}</h3>
        <span class="text-xs font-bold px-2 py-1 bg-black/10 rounded-full">${enfant.ecole}</span>
      </div>
      <p class="text-sm ${textClass}">${enfant.classe}</p>
    `;
    
    card.addEventListener('click', () => {
      enfantsMockData.forEach(e => e.active = false);
      enfant.active = true;
      renderEnfants();
      // Ici, on déclencherait une requête fetch ou une lecture IndexedDB pour charger les datas de cet enfant
    });

    enfantsContainer.appendChild(card);
  });
}

// Initialisation
renderEnfants();


// --- Logique de navigation par onglets ---
const tabs = ['resultats', 'finances', 'actus'];

tabs.forEach(tab => {
  const btn = document.getElementById(`tab-${tab}`);
  const content = document.getElementById(`content-${tab}`);
  
  btn.addEventListener('click', () => {
    // Reset tout
    tabs.forEach(t => {
      const b = document.getElementById(`tab-${t}`);
      const c = document.getElementById(`content-${t}`);
      
      b.className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors';
      c.classList.add('hidden');
      c.classList.remove('block');
    });

    // Activer l'onglet cliqué
    btn.className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium transition-colors';
    content.classList.remove('hidden');
    content.classList.add('block');
  });
});

// ===== Déconnexion =====
// the button doesn't have an href in the parent HTML, but let's bind it
const logoutBtn = document.querySelector('aside .border-t button');
if (logoutBtn && logoutBtn.textContent.includes('Déconnexion')) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('hr_token');
    localStorage.removeItem('hr_user');
    window.location.href = '/login.html';
  });
}
