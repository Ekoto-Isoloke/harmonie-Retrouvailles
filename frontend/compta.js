import './style.css';

// ===== Auth verification =====
const token = localStorage.getItem('hr_token');
const userStr = localStorage.getItem('hr_user');

if (!token || !userStr) {
  window.location.href = '/login.html';
}

const user = JSON.parse(userStr);
document.querySelector('aside .p-6 p.font-semibold').textContent = `${user.nom} ${user.prenom}`;
document.querySelector('aside .p-6 p.text-xs').textContent = `Comptable – C.S. Harmonie / G.S. Retrouvailles`;

// ===== Données mock (simulent la base de données) =====
const MOCK_DB = {
  ecoles: [
    { id: 1, nom: 'C.S. Harmonie', type: 'Primaire' },
    { id: 2, nom: 'G.S. Retrouvailles', type: 'Humanités' }
  ],
  classes: [
    { id: 1, ecole_id: 1, nom: '1ère Primaire', niveau: '1' },
    { id: 2, ecole_id: 1, nom: '2ème Primaire', niveau: '2' },
    { id: 3, ecole_id: 1, nom: '3ème Primaire', niveau: '3' },
    { id: 4, ecole_id: 1, nom: '4ème Primaire', niveau: '4' },
    { id: 5, ecole_id: 1, nom: '5ème Primaire', niveau: '5' },
    { id: 6, ecole_id: 1, nom: '6ème Primaire', niveau: '6' },
    { id: 7, ecole_id: 2, nom: '1ère Humanités', niveau: '7' },
    { id: 8, ecole_id: 2, nom: '2ème Humanités', niveau: '8' },
    { id: 9, ecole_id: 2, nom: '3ème Humanités Sc.', niveau: '9' },
    { id: 10, ecole_id: 2, nom: '4ème Humanités Sc.', niveau: '10' }
  ],
  eleves: [
    { id: 1, ecole_id: 1, classe_id: 6, nom: 'MUKENDI', prenom: 'Sarah' },
    { id: 2, ecole_id: 1, classe_id: 5, nom: 'TSHIMANGA', prenom: 'Paul' },
    { id: 3, ecole_id: 1, classe_id: 6, nom: 'ILUNGA', prenom: 'Grace' },
    { id: 4, ecole_id: 2, classe_id: 9, nom: 'MUKENDI', prenom: 'David' },
    { id: 5, ecole_id: 2, classe_id: 7, nom: 'KASONGO', prenom: 'Rachel' },
    { id: 6, ecole_id: 2, classe_id: 10, nom: 'MWAMBA', prenom: 'Joseph' }
  ],
  frais: [
    { id: 1, ecole_id: 1, classe_id: 6, nom_frais: 'Minerval – 1er Trimestre', montant: 150, devise: 'USD' },
    { id: 2, ecole_id: 1, classe_id: 6, nom_frais: 'Frais d\'internat', montant: 200, devise: 'USD' },
    { id: 3, ecole_id: 1, classe_id: 5, nom_frais: 'Minerval – 1er Trimestre', montant: 130, devise: 'USD' },
    { id: 4, ecole_id: 2, classe_id: 9, nom_frais: 'Minerval – 1er Trimestre', montant: 200, devise: 'USD' },
    { id: 5, ecole_id: 2, classe_id: 9, nom_frais: 'Frais Labo Sciences', montant: 50, devise: 'USD' },
    { id: 6, ecole_id: 2, classe_id: 7, nom_frais: 'Minerval – 1er Trimestre', montant: 180, devise: 'USD' },
    { id: 7, ecole_id: 2, classe_id: 10, nom_frais: 'Minerval – 1er Trimestre', montant: 220, devise: 'USD' }
  ],
  taux_usd_cdf: 2850
};

// ===== Stockage local des paiements =====
const STORAGE_KEY = 'hr_compta_paiements';

function getPaiements() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePaiement(p) {
  const all = getPaiements();
  all.unshift(p);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 100)));
}

// ===== Éléments du DOM =====
const ecoleSelect = document.getElementById('ecole');
const classeSelect = document.getElementById('classe');
const eleveSelect = document.getElementById('eleve');
const fraisSelect = document.getElementById('frais');
const montantInput = document.getElementById('montant');
const deviseSelect = document.getElementById('devise');
const calculZone = document.getElementById('calcul-zone');
const form = document.getElementById('form-paiement');

// Stats
const statCount = document.getElementById('stat-count');
const statTotal = document.getElementById('stat-total');
const statTaux = document.getElementById('stat-taux');

// Modal
const modalBordereau = document.getElementById('modal-bordereau');
const bordereauDetails = document.getElementById('bordereau-details');
const btnPrint = document.getElementById('btn-print');
const btnCloseBordereau = document.getElementById('btn-close-bordereau');

// ===== Logique en cascade =====
ecoleSelect.addEventListener('change', () => {
  const ecoleId = parseInt(ecoleSelect.value);
  const classes = MOCK_DB.classes.filter(c => c.ecole_id === ecoleId);
  classeSelect.innerHTML = '<option value="">Sélectionner une classe</option>' +
    classes.map(c => `<option value="${c.id}">${c.nom}</option>`).join('');
  eleveSelect.innerHTML = '<option value="">Sélectionner un élève</option>';
  fraisSelect.innerHTML = '<option value="">Sélectionner le frais</option>';
  hideCalcul();
});

classeSelect.addEventListener('change', () => {
  const classeId = parseInt(classeSelect.value);
  const eleves = MOCK_DB.eleves.filter(e => e.classe_id === classeId);
  eleveSelect.innerHTML = '<option value="">Sélectionner un élève</option>' +
    eleves.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join('');

  const frais = MOCK_DB.frais.filter(f => f.classe_id === classeId);
  fraisSelect.innerHTML = '<option value="">Sélectionner le frais</option>' +
    frais.map(f => `<option value="${f.id}">${f.nom_frais} (${f.montant} ${f.devise})</option>`).join('');
  hideCalcul();
});

// Affichage du calcul quand tout est rempli
fraisSelect.addEventListener('change', updateCalcul);
montantInput.addEventListener('input', updateCalcul);
deviseSelect.addEventListener('change', updateCalcul);

function hideCalcul() {
  calculZone.classList.add('hidden');
}

function updateCalcul() {
  const fraisId = parseInt(fraisSelect.value);
  const montant = parseFloat(montantInput.value);
  const devise = deviseSelect.value;

  if (!fraisId || isNaN(montant) || montant <= 0) {
    hideCalcul();
    return;
  }

  const frais = MOCK_DB.frais.find(f => f.id === fraisId);
  if (!frais) return;

  // Calculer déjà payé depuis le localStorage
  const eleveId = parseInt(eleveSelect.value);
  const paiements = getPaiements().filter(p => p.eleve_id === eleveId && p.frais_id === fraisId);
  const dejaPaye = paiements.reduce((sum, p) => sum + p.montant_converti, 0);

  // Conversion si devise différente
  let montantConverti = montant;
  if (devise !== frais.devise) {
    if (frais.devise === 'USD' && devise === 'CDF') {
      montantConverti = montant / MOCK_DB.taux_usd_cdf;
    } else if (frais.devise === 'CDF' && devise === 'USD') {
      montantConverti = montant * MOCK_DB.taux_usd_cdf;
    }
  }

  const reste = frais.montant - dejaPaye - montantConverti;

  document.getElementById('calc-total').textContent = `${frais.montant.toFixed(2)} ${frais.devise}`;
  document.getElementById('calc-paye').textContent = `${dejaPaye.toFixed(2)} ${frais.devise}`;
  document.getElementById('calc-actuel').textContent = `${montantConverti.toFixed(2)} ${frais.devise}`;
  document.getElementById('calc-reste').textContent = `${Math.max(0, reste).toFixed(2)} ${frais.devise}`;
  document.getElementById('calc-reste').className = reste <= 0 ? 'font-bold text-green-600' : 'font-bold text-red-600';

  calculZone.classList.remove('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eleveId = parseInt(eleveSelect.value);
  const fraisId = parseInt(fraisSelect.value);
  const montant = parseFloat(montantInput.value);
  const devise = deviseSelect.value;

  if (!eleveId || !fraisId || isNaN(montant) || montant <= 0) return;

  const btnSubmit = document.getElementById('btn-submit');
  const originalText = btnSubmit.innerHTML;
  btnSubmit.innerHTML = 'Traitement...';
  btnSubmit.disabled = true;

  try {
    const response = await fetch('http://localhost:5000/api/comptabilite/paiement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        eleve_id: eleveId,
        frais_scolaire_id: fraisId,
        montant_paye: montant,
        devise_paiement: devise
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du paiement');
    }

    // Si on veut télécharger le PDF directement, on devrait gérer la réponse comme un blob.
    // Pour simplifier ici et garder l'interface actuelle, on lit le blob pour le PDF
    // et on affiche la modale avec les infos locales.
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // On simule les données pour le bordereau UI (en vrai on les récupérerait via l'API)
    const frais = MOCK_DB.frais.find(f => f.id === fraisId);
    const eleve = MOCK_DB.eleves.find(el => el.id === eleveId);
    
    const txn = 'TXN-' + Date.now(); // Simulated UI transaction ID since the response is a PDF blob

    const paiement = {
      numero: txn,
      eleve_nom: `${eleve.nom} ${eleve.prenom}`,
      frais_nom: frais.nom_frais,
      montant_paye: montant,
      devise: devise,
      reste: Math.max(0, frais.montant - montant), // Simplification pour l'UI
      devise_frais: frais.devise,
      date: new Date().toLocaleString('fr-CD'),
      pdfUrl: url
    };

    savePaiement(paiement);
    showBordereau(paiement);
    updateStats();
    renderRecents();
    form.reset();
    hideCalcul();
  } catch (error) {
    alert(error.message);
  } finally {
    btnSubmit.innerHTML = originalText;
    btnSubmit.disabled = false;
  }
});

function showBordereau(p) {
  bordereauDetails.innerHTML = `
    <div class="flex justify-between"><span class="text-slate-500">N° Transaction</span><span class="font-mono font-bold">${p.numero}</span></div>
    <div class="flex justify-between"><span class="text-slate-500">Élève</span><span class="font-bold">${p.eleve_nom}</span></div>
    <div class="flex justify-between"><span class="text-slate-500">Motif</span><span>${p.frais_nom}</span></div>
    <hr class="border-slate-200">
    <div class="flex justify-between"><span class="text-slate-500">Montant payé</span><span class="font-bold text-green-600">${p.montant_paye.toFixed(2)} ${p.devise}</span></div>
    ${p.taux ? `<div class="flex justify-between"><span class="text-slate-500">Taux appliqué</span><span>1 USD = ${p.taux} CDF</span></div>` : ''}
    <div class="flex justify-between"><span class="text-slate-500">Reste à payer</span><span class="font-bold ${p.reste <= 0 ? 'text-green-600' : 'text-red-600'}">${p.reste.toFixed(2)} ${p.devise_frais}</span></div>
    <hr class="border-slate-200">
    <div class="flex justify-between"><span class="text-slate-500">Date</span><span>${p.date}</span></div>
  `;
  window.currentPdfUrl = p.pdfUrl; // Store the PDF URL for printing
  modalBordereau.classList.remove('hidden');
}

btnCloseBordereau.addEventListener('click', () => {
  modalBordereau.classList.add('hidden');
});

btnPrint.addEventListener('click', () => {
  // If we have a real PDF blob URL attached to the modal context
  if (window.currentPdfUrl) {
      window.open(window.currentPdfUrl, '_blank');
  } else {
      window.print();
  }
});

// ===== Stats =====
function updateStats() {
  const today = new Date().toLocaleDateString('fr-CD');
  const todayPaiements = getPaiements().filter(p => {
    // Comparer par date (simplification)
    return p.date && p.date.includes(today.split(' ')[0]);
  });
  // Fallback: use all paiements from today stored
  const allPaiements = getPaiements();
  statCount.textContent = allPaiements.length;
  const totalUSD = allPaiements.reduce((sum, p) => sum + p.montant_converti, 0);
  statTotal.innerHTML = `${totalUSD.toFixed(2)} <span class="text-lg text-slate-500">USD</span>`;
  statTaux.innerHTML = `${MOCK_DB.taux_usd_cdf.toLocaleString()} <span class="text-lg text-slate-500">CDF</span>`;
}

// ===== Paiements récents =====
function renderRecents() {
  const tbody = document.getElementById('recents-tbody');
  const paiements = getPaiements();

  if (paiements.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400">Aucun paiement enregistré.</td></tr>';
    return;
  }

  tbody.innerHTML = paiements.map(p => `
    <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td class="px-6 py-4 font-mono text-xs">${p.numero}</td>
      <td class="px-6 py-4 font-medium">${p.eleve_nom}</td>
      <td class="px-6 py-4">${p.frais_nom}</td>
      <td class="px-6 py-4 font-medium text-green-600">${p.montant_paye.toFixed(2)} ${p.devise}</td>
      <td class="px-6 py-4 font-medium ${p.reste <= 0 ? 'text-green-600' : 'text-red-600'}">${p.reste.toFixed(2)} ${p.devise_frais}</td>
      <td class="px-6 py-4 text-slate-500 text-xs">${p.date}</td>
    </tr>
  `).join('');
}

// ===== Navigation onglets =====
const tabs = ['encaissement', 'recents'];
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
updateStats();
renderRecents();
