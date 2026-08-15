// presence.js - Module de reconnaissance faciale pour le pointage

let presenceStream = null;
let presenceScanLineAnim = null;
let presencePhaseTimeout = null;

// Mock database for the demo
const MOCK_USER = {
  name: "Ekoto Isoloke",
  role: "Directeur Général",
  school: "C.S. Harmonie & G.S. Retrouvailles",
  photo: "https://ui-avatars.com/api/?name=Ekoto+Isoloke&background=0D8B6D&color=fff&size=150"
};

window.openPresenceScanner = async function() {
  const modal = document.getElementById('presence-modal');
  const video = document.getElementById('presence-video');
  const statusBox = document.getElementById('presence-status-box');
  const statusText = document.getElementById('presence-status-text');
  const statusSub = document.getElementById('presence-status-sub');
  const resultCard = document.getElementById('presence-result-card');
  const scannerView = document.getElementById('presence-scanner-view');
  
  if (!modal || !video) return;

  // Reset UI
  resultCard.classList.add('hidden');
  resultCard.classList.remove('flex');
  scannerView.style.display = 'block';
  statusBox.style.display = 'block';
  statusText.textContent = "Veuillez regarder la caméra";
  statusText.className = "text-white font-bold text-lg";
  statusSub.textContent = "Initialisation du capteur biométrique...";
  
  modal.classList.remove('opacity-0', 'pointer-events-none');
  
  try {
    presenceStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = presenceStream;
    await video.play();
    
    // Start fake scanning sequence
    startPresenceSequence();
  } catch (err) {
    statusText.textContent = "Erreur Caméra";
    statusText.className = "text-red-500 font-bold text-lg";
    statusSub.textContent = "Veuillez autoriser l'accès à la caméra pour le pointage.";
  }
};

window.closePresenceScanner = function() {
  const modal = document.getElementById('presence-modal');
  if (presenceStream) {
    presenceStream.getTracks().forEach(t => t.stop());
    presenceStream = null;
  }
  clearInterval(presenceScanLineAnim);
  clearTimeout(presencePhaseTimeout);
  
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
  }
};

function startPresenceSequence() {
  const statusText = document.getElementById('presence-status-text');
  const statusSub = document.getElementById('presence-status-sub');
  const scanLine = document.getElementById('presence-scan-line');
  
  // Animate scan line
  let pos = 0;
  let dir = 1;
  clearInterval(presenceScanLineAnim);
  presenceScanLineAnim = setInterval(() => {
    pos += dir * 2;
    if (pos >= 100) dir = -1;
    if (pos <= 0) dir = 1;
    if(scanLine) scanLine.style.top = pos + '%';
  }, 30);

  // Sequence steps
  statusText.textContent = "Analyse faciale en cours...";
  statusSub.textContent = "Ne bougez pas...";
  
  presencePhaseTimeout = setTimeout(() => {
    statusText.textContent = "Recherche dans la base de données...";
    statusSub.textContent = "Comparaison des traits biométriques...";
    statusText.className = "text-emerald-400 font-bold text-lg animate-pulse";
    
    presencePhaseTimeout = setTimeout(() => {
      showPresenceResult();
    }, 2000);
  }, 2000);
}

function showPresenceResult() {
  clearInterval(presenceScanLineAnim);
  
  const statusBox = document.getElementById('presence-status-box');
  const scannerView = document.getElementById('presence-scanner-view');
  const resultCard = document.getElementById('presence-result-card');
  
  const photo = document.getElementById('presence-user-photo');
  const welcomeMsg = document.getElementById('presence-welcome-msg');
  const userRole = document.getElementById('presence-user-role');
  const timeLabel = document.getElementById('presence-time-label');
  const timeValue = document.getElementById('presence-time-value');
  const statusBadge = document.getElementById('presence-status-badge');
  const timeIcon = document.getElementById('presence-time-icon');
  
  // Check local storage for today's state
  const today = new Date().toLocaleDateString();
  const storageKey = `presence_${today}`;
  let hasArrived = localStorage.getItem(storageKey);
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  // Populating data
  photo.src = MOCK_USER.photo;
  userRole.textContent = `${MOCK_USER.role} • ${MOCK_USER.school}`;
  timeValue.textContent = timeStr;
  
  if (!hasArrived) {
    // Action: ARRIVAL
    localStorage.setItem(storageKey, 'arrived');
    welcomeMsg.textContent = `Bienvenue Mr. ${MOCK_USER.name}`;
    timeLabel.textContent = "Heure d'arrivée";
    
    statusBadge.textContent = "Présent";
    statusBadge.className = "px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    
    timeIcon.className = "w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400";
    timeIcon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>`;
    
    saveToAdminLog('Arrivée', timeStr);
  } else {
    // Action: DEPARTURE
    localStorage.removeItem(storageKey); // Allow testing multiple times, or keep it 'departed'
    welcomeMsg.textContent = `Au revoir Mr. ${MOCK_USER.name}, bon retour à la maison`;
    timeLabel.textContent = "Heure de départ";
    
    statusBadge.textContent = "Bon retour";
    statusBadge.className = "px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]";
    
    timeIcon.className = "w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400";
    timeIcon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>`;
    
    saveToAdminLog('Départ', timeStr);
  }

  // Switch UI
  scannerView.style.display = 'none';
  statusBox.style.display = 'none';
  
  resultCard.classList.remove('hidden');
  resultCard.classList.add('flex');
  
  // Small delay for scale animation
  setTimeout(() => {
    resultCard.classList.remove('scale-95');
    resultCard.classList.add('scale-100');
  }, 50);

  // Auto-close after 5 seconds
  presencePhaseTimeout = setTimeout(() => {
    closePresenceScanner();
  }, 5000);
}

// Function to simulate saving to a database so the admin dashboard can read it
function saveToAdminLog(type, timeStr) {
  try {
    let dbStr = localStorage.getItem('admin_db');
    if (!dbStr) return;
    let db = JSON.parse(dbStr);
    
    // Format date as YYYY-MM-DD to match admin_db format
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; 
    
    if (type === 'Départ') {
      const todayLog = db.rh.pointages.find(p => p.nom === MOCK_USER.name && p.date === dateStr);
      if (todayLog) {
        todayLog.statut = 'Terminé';
        // We could add a 'depart' field if the dashboard supported it, but let's just update status for now
      }
    } else {
      // Arrival
      const newId = Math.max(0, ...db.rh.pointages.map(p => p.id)) + 1;
      db.rh.pointages.unshift({
        id: newId,
        nom: MOCK_USER.name,
        date: dateStr,
        statut: 'Présent',
        arrivee: timeStr,
        role: MOCK_USER.role,
        ecole: 'Harmonie' // or extract from MOCK_USER.school
      });
    }
    
    localStorage.setItem('admin_db', JSON.stringify(db));
  } catch(e) {
    console.error("Error saving to admin log", e);
  }
}
