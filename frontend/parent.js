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

// Rendu des enfants dans l'entête
const enfantsContainer = document.getElementById('enfants-container');

async function loadEnfants() {
  enfantsContainer.innerHTML = '<div class="text-xs text-gray-400 p-4">Chargement des données de vos enfants...</div>';

  try {
    const res = await fetch(`/api/parent/enfants?parent_id=${user.id}`);
    if (!res.ok) throw new Error('Erreur');
    const data = await res.json();
    const enfants = data.enfants || [];

    if (enfants.length === 0) {
      enfantsContainer.innerHTML = `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300">
          🌱 Aucun enfant encore associé à ce compte parent. Vos enfants apparaîtront automatiquement ici dès la validation de leur inscription.
        </div>
      `;
      return;
    }

    enfantsContainer.innerHTML = '';
    enfants.forEach((enfant, idx) => {
      const card = document.createElement('div');
      const isFirst = idx === 0;
      const bgClass = isFirst ? 'bg-amber-500 text-gray-950 font-bold shadow-lg shadow-amber-500/20' : 'bg-[#112240]/80 text-white border border-white/10 hover:bg-[#112240]/50';
      
      card.className = `min-w-[240px] p-4 rounded-2xl cursor-pointer transition-all duration-300 ${bgClass}`;
      card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-black text-sm uppercase">${enfant.prenom} ${enfant.nom}</h3>
          <span class="text-[10px] font-bold px-2 py-0.5 bg-black/20 rounded-full">${enfant.ecole === 'harmonie' ? 'Harmonie' : 'Retrouvailles'}</span>
        </div>
        <p class="text-xs opacity-80 font-mono">${enfant.classe} • ${enfant.matricule || ''}</p>
      `;
      
      enfantsContainer.appendChild(card);
    });
  } catch(e) {
    enfantsContainer.innerHTML = `
      <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400">
        Portail Famille actif • En attente des inscriptions officielles
      </div>
    `;
  }
}

loadEnfants();

// --- Logique de navigation par onglets ---
const tabs = ['resultats', 'finances', 'actus'];

tabs.forEach(tab => {
  const btn = document.getElementById(`tab-${tab}`);
  const content = document.getElementById(`content-${tab}`);
  
  if (btn && content) {
    btn.addEventListener('click', () => {
      tabs.forEach(t => {
        const b = document.getElementById(`tab-${t}`);
        const c = document.getElementById(`content-${t}`);
        if (b) b.className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 font-medium transition-colors';
        if (c) {
          c.classList.add('hidden');
          c.classList.remove('block');
        }
      });

      btn.className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/20 text-amber-300 font-bold transition-colors';
      content.classList.remove('hidden');
      content.classList.add('block');
    });
  }
});

// ===== Déconnexion =====
const logoutBtn = document.querySelector('aside .border-t button');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('hr_token');
    localStorage.removeItem('hr_user');
    window.location.href = '/login.html';
  });
}
