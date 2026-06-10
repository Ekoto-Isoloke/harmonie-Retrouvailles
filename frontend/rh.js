import './style.css';

// ===== Auth verification =====
const token = localStorage.getItem('hr_token');
const userStr = localStorage.getItem('hr_user');

if (!token || !userStr) {
  window.location.href = '/login.html';
}

const user = JSON.parse(userStr);
document.getElementById('rh-user-name').textContent = `${user.nom} ${user.prenom}`;

// ===== Horloge vivante =====
const clockEl = document.getElementById('live-clock');
const secondsEl = document.getElementById('live-seconds');
const dateEl = document.getElementById('date-today');

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${h}:${m}`;
  secondsEl.textContent = `:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// Date du jour
const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const now = new Date();
dateEl.textContent = `${jours[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]} ${now.getFullYear()}`;

// ===== État du pointage (mock local) =====
let state = {
  arrivee: null,
  depart: null,
  minutesRetard: 0,
  statut: 'Non pointé'
};

const HEURE_OFFICIELLE = { h: 7, m: 30 };

const btnArrivee = document.getElementById('btn-arrivee');
const btnDepart = document.getElementById('btn-depart');
const statusBadge = document.getElementById('status-badge');
const statusText = document.getElementById('status-text');
const infoArrivee = document.getElementById('info-arrivee');
const infoDepart = document.getElementById('info-depart');
const infoRetard = document.getElementById('info-retard');
const modalMotif = document.getElementById('modal-motif');
const motifInput = document.getElementById('motif-input');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

function pad(n) { return String(n).padStart(2, '0'); }

function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function updateUI() {
  // Arrivée
  infoArrivee.textContent = state.arrivee ? formatTime(state.arrivee) : '—';
  infoDepart.textContent = state.depart ? formatTime(state.depart) : '—';
  infoRetard.textContent = `${state.minutesRetard} min`;

  // Status badge
  statusText.textContent = state.statut;
  statusBadge.className = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ';
  switch (state.statut) {
    case 'Présent':
      statusBadge.classList.add('bg-green-100', 'text-green-700');
      break;
    case 'En retard':
      statusBadge.classList.add('bg-amber-100', 'text-amber-700');
      break;
    case 'Terminé':
      statusBadge.classList.add('bg-slate-100', 'text-slate-600');
      break;
    default:
      statusBadge.classList.add('bg-slate-100', 'text-slate-500');
  }

  // Buttons
  if (state.arrivee && !state.depart) {
    btnArrivee.disabled = true;
    btnArrivee.className = 'bg-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-semibold text-lg cursor-not-allowed transition-all flex items-center gap-3';
    btnDepart.disabled = false;
    btnDepart.className = 'bg-gradient-to-r from-red-500 to-red-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-3';
  } else if (state.depart) {
    btnArrivee.disabled = true;
    btnArrivee.className = 'bg-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-semibold text-lg cursor-not-allowed transition-all flex items-center gap-3';
    btnDepart.disabled = true;
    btnDepart.className = 'bg-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-semibold text-lg cursor-not-allowed transition-all flex items-center gap-3';
  }
}

// ===== Arrivée =====
btnArrivee.addEventListener('click', () => {
  const maintenant = new Date();
  const minutesActuelles = maintenant.getHours() * 60 + maintenant.getMinutes();
  const minutesOfficielles = HEURE_OFFICIELLE.h * 60 + HEURE_OFFICIELLE.m;
  const retard = minutesActuelles - minutesOfficielles;

  if (retard > 0) {
    // Ouvrir la modale de motif
    modalMotif.classList.remove('hidden');
  } else {
    finaliserArrivee(null);
  }
});

async function finaliserArrivee(motif) {
  try {
    const maintenant = new Date();
    const response = await fetch('http://localhost:5000/api/rh/pointage/arrivee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        utilisateur_id: user.id,
        heure_arrivee: pad(maintenant.getHours()) + ':' + pad(maintenant.getMinutes()) + ':00',
        motif: motif
      })
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.message || 'Erreur lors du pointage');
      return;
    }

    const data = await response.json();
    
    // Mettre à jour l'état local
    state.arrivee = maintenant;
    state.minutesRetard = data.pointage.minutes_retard;
    state.statut = data.pointage.statut;
    
    saveToHistory(motif);
    updateUI();
  } catch (error) {
    console.error('Erreur', error);
    alert('Erreur réseau');
  }
}

modalConfirm.addEventListener('click', () => {
  const motif = motifInput.value.trim() || null;
  modalMotif.classList.add('hidden');
  motifInput.value = '';
  finaliserArrivee(motif);
});

modalCancel.addEventListener('click', () => {
  modalMotif.classList.add('hidden');
  motifInput.value = '';
  // On pointe quand même, sans motif
  finaliserArrivee(null);
});

// ===== Départ =====
btnDepart.addEventListener('click', async () => {
  try {
    const maintenant = new Date();
    const response = await fetch('http://localhost:5000/api/rh/pointage/depart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        utilisateur_id: user.id,
        heure_depart: pad(maintenant.getHours()) + ':' + pad(maintenant.getMinutes()) + ':00'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.message || 'Erreur lors du pointage de départ');
      return;
    }

    state.depart = maintenant;
    state.statut = 'Terminé';
    updateHistoryDepart();
    updateUI();
  } catch (error) {
    console.error('Erreur', error);
    alert('Erreur réseau');
  }
});

// ===== Historique local (localStorage) =====
const STORAGE_KEY = 'hr_pointage_historique';

function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveToHistory(motif) {
  const history = getHistory();
  const today = now.toISOString().split('T')[0];
  // Empêcher un double pointage d'arrivée pour le même jour
  const existing = history.find(h => h.date === today);
  if (existing) return;

  history.unshift({
    date: today,
    arrivee: formatTime(state.arrivee),
    depart: null,
    retard: state.minutesRetard,
    statut: state.statut,
    motif: motif
  });

  // Garder les 30 derniers
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
  renderHistory();
}

function updateHistoryDepart() {
  const history = getHistory();
  const today = now.toISOString().split('T')[0];
  const entry = history.find(h => h.date === today);
  if (entry) {
    entry.depart = formatTime(state.depart);
    entry.statut = 'Terminé';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  const tbody = document.getElementById('historique-tbody');
  const history = getHistory();

  if (history.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-slate-400">Aucun historique de pointage.</td></tr>';
    return;
  }

  tbody.innerHTML = history.map(h => {
    const statutClass = h.statut === 'Présent' ? 'text-green-600 bg-green-50' :
                        h.statut === 'En retard' ? 'text-amber-600 bg-amber-50' :
                        'text-slate-600 bg-slate-50';
    return `
      <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
        <td class="px-6 py-4 font-medium">${h.date}</td>
        <td class="px-6 py-4">${h.arrivee || '—'}</td>
        <td class="px-6 py-4">${h.depart || '—'}</td>
        <td class="px-6 py-4">${h.retard > 0 ? h.retard + ' min' : '—'}</td>
        <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${statutClass}">${h.statut}</span></td>
      </tr>
    `;
  }).join('');
}

// ===== Charger l'état d'aujourd'hui si existant =====
function loadTodayState() {
  const history = getHistory();
  const today = now.toISOString().split('T')[0];
  const entry = history.find(h => h.date === today);
  if (entry) {
    state.arrivee = new Date(`${today}T${entry.arrivee}:00`);
    state.minutesRetard = entry.retard;
    state.statut = entry.statut;
    if (entry.depart) {
      state.depart = new Date(`${today}T${entry.depart}:00`);
      state.statut = 'Terminé';
    }
    updateUI();
  }
}

// ===== Navigation onglets =====
const tabs = ['pointage', 'historique'];
tabs.forEach(tab => {
  const btn = document.getElementById(`tab-${tab}`);
  const content = document.getElementById(`content-${tab}`);
  btn.addEventListener('click', () => {
    tabs.forEach(t => {
      document.getElementById(`tab-${t}`).className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors';
      document.getElementById(`content-${t}`).classList.add('hidden');
      document.getElementById(`content-${t}`).classList.remove('block');
    });
    btn.className = 'tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium transition-colors';
    content.classList.remove('hidden');
    content.classList.add('block');
  });
});

// ===== Déconnexion =====
const logoutBtn = document.querySelector('a[href="/login.html"]');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('hr_token');
    localStorage.removeItem('hr_user');
    window.location.href = '/login.html';
  });
}

// ===== Init =====
loadTodayState();
renderHistory();
