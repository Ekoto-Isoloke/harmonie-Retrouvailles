const fs = require('fs');
const file = 'admin-login.html';
const content = fs.readFileSync(file, 'utf8');

const newHtml = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portail Super-Administration | Harmonie-Retrouvailles</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Outfit', 'sans-serif'] },
          colors: {
            gold: { 400: '#d2a353', 500: '#c7882c', 600: '#b06b22' }
          },
          animation: {
            'blob': 'blob 10s infinite',
            'fade-in': 'fadeIn 0.6s ease-out',
            'slide-up': 'slideUp 0.6s ease-out forwards',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          },
          keyframes: {
            blob: {
              '0%': { transform: 'translate(0px, 0px) scale(1)' },
              '33%': { transform: 'translate(40px, -60px) scale(1.1)' },
              '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
              '100%': { transform: 'translate(0px, 0px) scale(1)' }
            },
            fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
          }
        }
      }
    }
  </script>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { background-color: #030712; color: #f9fafb; overflow-x: hidden; }
    .glass-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7); }
    .glass-input { background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.1); color: white; transition: all 0.3s ease; }
    .glass-input:focus { background: rgba(0, 0, 0, 0.5); border-color: #c7882c; box-shadow: 0 0 0 4px rgba(199, 136, 44, 0.15); outline: none; }
    .glass-input::placeholder { color: rgba(255, 255, 255, 0.3); }
    
    .btn-premium { background: linear-gradient(135deg, #d2a353 0%, #b06b22 100%); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3); box-shadow: 0 10px 25px -5px rgba(199, 136, 44, 0.5); transition: all 0.3s ease; }
    .btn-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(199, 136, 44, 0.7); filter: brightness(1.15); }
    .btn-premium:active { transform: translateY(0); }
    
    .tab-active { background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
    .tab-idle { color: rgba(255, 255, 255, 0.4); font-weight: 500; border: 1px solid transparent; transition: all 0.2s; }
    .tab-idle:hover { color: rgba(255, 255, 255, 0.8); background: rgba(255,255,255,0.04); }

    .bio-scanner { position: relative; overflow: hidden; }
    .bio-scanner::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
    .bio-scanner:hover::after { opacity: 1; animation: pulse 2s infinite; }

    /* Noise overlay */
    .bg-noise { position: fixed; inset: 0; z-index: -1; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); pointer-events: none; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 sm:p-8 relative">

  <!-- Background Elements -->
  <div class="bg-noise"></div>
  <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[130px] mix-blend-screen animate-blob"></div>
    <div class="absolute top-[20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-amber-900/15 blur-[120px] mix-blend-screen animate-blob" style="animation-delay: 2s"></div>
    <div class="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/15 blur-[140px] mix-blend-screen animate-blob" style="animation-delay: 4s"></div>
  </div>

  <!-- Toast -->
  <div id="toast" class="fixed top-6 right-6 z-[999] translate-x-[200%] transition-transform duration-400 ease-out flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold border border-white/10 glass-card">
    <span id="toast-icon" class="text-xl">✅</span>
    <span id="toast-message">Opération réussie !</span>
  </div>

  <!-- Main Container -->
  <div class="w-full max-w-[1150px] glass-card rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row animate-fade-in relative z-10 mx-auto">
    
    <!-- LEFT PANEL: Branding & Info -->
    <div class="lg:w-5/12 bg-gradient-to-b from-gray-900/90 to-black p-10 lg:p-14 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
      
      <!-- Top Section -->
      <div>
        <div class="flex items-center gap-4 mb-12">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-bold text-3xl text-white shadow-[0_0_25px_rgba(199,136,44,0.4)] ring-2 ring-gold-400/20">HR</div>
          <div>
            <h1 class="font-display font-bold text-2xl text-white tracking-wide">Harmonie</h1>
            <p class="text-xs text-gold-500 font-bold tracking-[0.25em] uppercase mt-1">Retrouvailles</p>
          </div>
        </div>

        <h2 id="portal-title" class="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-5 animate-slide-up" style="animation-delay: 0.1s">
          Portail<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Super-Admin</span>
        </h2>
        <p id="portal-sub" class="text-sm text-gray-400 leading-relaxed mb-12 animate-slide-up" style="animation-delay: 0.2s">
          Accès ultra-sécurisé exclusif à la Direction Générale et au Super-Administrateur.
        </p>

        <!-- Feature List -->
        <div class="space-y-5 animate-slide-up" style="animation-delay: 0.3s">
          <div class="flex items-center gap-5 group">
            <div class="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:border-gold-500/30 transition-all duration-300">
              <i data-lucide="shield-check" class="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Authentification Biométrique (RBAC)</span>
          </div>
          
          <div class="flex items-center gap-5 group">
            <div class="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-300">
              <i data-lucide="award" class="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Palmarès EXETAT & TENASOSP</span>
          </div>

          <div class="flex items-center gap-5 group">
            <div class="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
              <i data-lucide="fingerprint" class="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Pointage Numérique Avancé</span>
          </div>

          <div class="flex items-center gap-5 group">
            <div class="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all duration-300">
              <i data-lucide="database" class="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Archives et Coffre-fort Cloud</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-14 pt-8 border-t border-white/10 flex items-center justify-between animate-slide-up" style="animation-delay: 0.4s">
        <span class="text-xs text-gray-500">&copy; 2026 HR-ERP EPST</span>
        <span class="flex items-center gap-2 text-xs text-emerald-400 font-bold tracking-wide bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Système en Ligne
        </span>
      </div>
    </div>

    <!-- RIGHT PANEL: Forms -->
    <div class="flex-1 p-8 sm:p-14 lg:p-20 flex flex-col justify-center relative overflow-y-auto bg-gray-900/30">
      
      <!-- Tabs -->
      <div class="flex p-1.5 bg-black/50 border border-white/10 rounded-2xl mb-12 w-full max-w-[420px] mx-auto shrink-0">
        <button id="tab-login" onclick="showTab('login')" class="flex-1 py-3.5 rounded-xl text-sm transition-all tab-active">
          Se Connecter
        </button>
        <button id="tab-register" onclick="showTab('register')" class="flex-1 py-3.5 rounded-xl text-sm transition-all tab-idle">
          Créer un Compte
        </button>
      </div>

      <!-- =========== FORM 1 : CONNEXION =========== -->
      <div id="panel-login" class="w-full max-w-[420px] mx-auto animate-slide-up" style="animation-delay: 0.1s">
        
        <div class="mb-10 text-center">
          <h3 id="form-login-title" class="font-display text-3xl font-bold text-white mb-3">Accès Direction</h3>
          <p class="text-sm text-gray-400">Veuillez vous identifier avec vos accès sécurisés.</p>
        </div>

        <form onsubmit="handleLogin(event)" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email / Identifiant</label>
            <div class="relative group">
              <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-400 transition-colors"></i>
              <input type="text" id="login-email" required placeholder="admin@harmonie.cd" class="w-full glass-input rounded-2xl py-4 pl-12 pr-4 text-sm font-medium">
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Mot de passe</label>
              <a href="#" class="text-xs text-gold-400 hover:text-gold-300 hover:underline transition-colors font-medium">Oublié ?</a>
            </div>
            <div class="relative group">
              <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-400 transition-colors"></i>
              <input type="password" id="login-password" required placeholder="••••••••" class="w-full glass-input rounded-2xl py-4 pl-12 pr-4 text-sm font-medium tracking-widest">
            </div>
          </div>

          <!-- Error Alert -->
          <div id="login-error" class="hidden p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3">
            <i data-lucide="alert-triangle" class="w-5 h-5 shrink-0 mt-0.5"></i>
            <span>Identifiants incorrects ou compte inexistant.</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="w-full btn-premium py-4 rounded-2xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 mt-4">
            <span id="btn-login-text">Connexion Sécurisée</span>
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </form>

        <div class="mt-10 relative">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div>
          <div class="relative flex justify-center text-xs"><span class="px-5 bg-[#0e1628] rounded-full text-gray-500 font-semibold tracking-widest uppercase">Ou</span></div>
        </div>

        <!-- Biometric Button -->
        <button type="button" onclick="biometricLogin()" class="w-full mt-10 group bio-scanner glass-input border border-blue-500/30 hover:border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl p-5 flex items-center justify-between transition-all">
          <div class="flex items-center gap-5">
            <div id="bio-icon-wrap" class="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <i data-lucide="fingerprint" class="w-6 h-6"></i>
            </div>
            <div class="text-left">
              <p id="bio-title" class="text-[15px] font-bold text-white mb-1">Connexion Biométrique</p>
              <p id="bio-sub" class="text-xs text-gray-400 font-medium">Scannez votre empreinte digitale</p>
            </div>
          </div>
          <div id="btn-bio-capture" class="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-white/50 group-hover:border-blue-400 group-hover:text-blue-400 transition-colors group-hover:bg-blue-400/10">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </div>
        </button>

      </div>

      <!-- =========== FORM 2 : CREATION DE COMPTE (PAGE UNIQUE) =========== -->
      <div id="panel-register" class="hidden w-full max-w-[420px] mx-auto animate-slide-up">
        
        <div class="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8 flex items-start gap-4 shadow-lg">
          <i data-lucide="info" class="w-6 h-6 text-amber-400 shrink-0 mt-0.5"></i>
          <p class="text-xs text-amber-200/90 leading-relaxed font-medium">Inscription réservée au personnel académique et administratif. Les accès seront vérifiés et validés par la Direction.</p>
        </div>

        <form onsubmit="handleRegister(event)" class="space-y-5">
          <!-- 1. Institution -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Institution d'Affectation</span>
              <span id="inst-badge-status" class="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md border border-blue-500/30 font-bold">G.S. Retrouvailles</span>
            </label>
            <input type="hidden" id="reg-institution" value="Retrouvailles">
            <div class="grid grid-cols-2 gap-4">
              <button type="button" id="inst-harmonie" onclick="selectInstitution('Harmonie')" class="inst-card relative p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition-all text-left group">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md group-hover:scale-105 transition-transform">CS</div>
                  <p class="text-xs font-bold text-white">C.S. Harmonie</p>
                </div>
                <p class="text-[10px] text-gray-500 font-medium">Maternelle & Primaire</p>
                <div id="check-harmonie" class="hidden absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(199,136,44,0.8)]"></div>
              </button>
              <button type="button" id="inst-retrouvailles" onclick="selectInstitution('Retrouvailles')" class="inst-card relative p-4 rounded-xl border border-blue-500/50 bg-blue-500/10 transition-all text-left group">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md group-hover:scale-105 transition-transform">GS</div>
                  <p class="text-xs font-bold text-white">G.S. Retrouvailles</p>
                </div>
                <p class="text-[10px] text-blue-200/60 font-medium">EB & Humanités</p>
                <div id="check-retrouvailles" class="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nom Complet</label>
              <input type="text" id="reg-fullname" required class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="Ex: Jean Dupont">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Téléphone</label>
              <input type="tel" id="reg-phone" required class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="+243...">
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
            <input type="email" id="reg-email" required class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="jean.dupont@harmonie.cd">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fonction / Rôle</label>
              <select id="reg-role" class="glass-input w-full rounded-xl px-4 py-3.5 text-sm [&>option]:bg-gray-900 [&>option]:text-white">
                <option value="Préfet">Préfet</option>
                <option value="D.E">Directeur des Études</option>
                <option value="Enseignant">Enseignant</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Option / Section</label>
              <select id="reg-option" class="glass-input w-full rounded-xl px-4 py-3.5 text-sm [&>option]:bg-gray-900 [&>option]:text-white">
                <option value="Biologie-Chimie">Biologie-Chimie</option>
                <option value="Math-Physique">Math-Physique</option>
                <option value="Commerciale">Commerciale</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cours (Optionnel)</label>
            <input type="text" id="reg-courses" class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="Ex: Mathématiques, Physique...">
          </div>
          
          <input type="hidden" id="reg-address" value="">

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mot de passe</label>
              <input type="password" id="reg-pwd" required class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="••••••••">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirmer</label>
              <input type="password" id="reg-pwd-confirm" required class="glass-input w-full rounded-xl px-4 py-3.5 text-sm" placeholder="••••••••">
            </div>
          </div>

          <button type="submit" class="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold text-[15px] tracking-wide transition-colors mt-6 shadow-[0_5px_20px_rgba(255,255,255,0.2)]">
            Créer mon compte
          </button>
        </form>
      </div>

    </div>
  </div>
`;

const scriptIndex = content.indexOf('<script>');
if (scriptIndex !== -1) {
    const scriptContent = content.substring(scriptIndex);
    fs.writeFileSync(file, newHtml + '\n' + scriptContent);
}
