// Inscription Logic - G.S. Retrouvailles & C.S. Harmonie

document.addEventListener('DOMContentLoaded', function () {
  var form                   = document.getElementById('inscription-form');
  var dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
  var institutionRadios      = document.querySelectorAll('input[name="institution"]');
  var demarcheRadios         = document.querySelectorAll('input[name="demarche"]');
  var stepDemarche           = document.getElementById('step-demarche');
  var matriculeContainer     = document.getElementById('matricule-container');
  var btnSubmit              = document.getElementById('btn-submit');
  var btnSubmitText          = document.getElementById('btn-submit-text');
  var btnSubmitSpinner       = document.getElementById('btn-submit-spinner');
  var formErrors             = document.getElementById('form-errors');
  var formErrorsText         = document.getElementById('form-errors-text');

  var currentInstitution = null;
  var currentDemarche    = 'nouvelle';

  // ─────────────────────────────────────────────
  // DONNÉES ORIENTATION — Système EPST / RDC
  // ─────────────────────────────────────────────
  var orientationData = {
    'non-technique': {
      label: 'Section Non Technique',
      icon: '📚',
      color: '#4f46e5',
      bg: '#eef2ff',
      border: '#c7d2fe',
      sousSections: {
        'sciences': {
          label: 'Sciences',
          icon: '🔬',
          options: [
            { val: 'math-physique',   text: 'Math-Physique' },
            { val: 'chimie-biologie', text: 'Chimie-Biologie' }
          ]
        },
        'litteraire': {
          label: 'Littéraire',
          icon: '📖',
          options: [
            { val: 'latin-philo',       text: 'Latin-Philosophie' },
            { val: 'hist-geo-socio',    text: 'Histoire-Géo-Socio-Économie' }
          ]
        },
        'pedagogie': {
          label: 'Pédagogie Générale',
          icon: '🎓',
          options: [
            { val: 'pedagogie-generale', text: 'Pédagogie Générale' }
          ]
        }
      }
    },
    'technique': {
      label: 'Section Technique',
      icon: '⚙️',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      sousSections: {
        'tech-commerciale': {
          label: 'Commerciale et de Gestion',
          icon: '💼',
          options: [
            { val: 'commerciale-gestion',   text: 'Commerciale et Gestion' },
            { val: 'secretariat-bureautique', text: 'Secrétariat-Bureautique' },
            { val: 'informatique-gestion',  text: 'Informatique de Gestion' }
          ]
        },
        'tech-industrielle': {
          label: 'Industrielle',
          icon: '🏭',
          options: [
            { val: 'electricite',     text: 'Électricité' },
            { val: 'mecanique',       text: 'Mécanique Générale' },
            { val: 'construction',    text: 'Construction' },
            { val: 'electronique',    text: 'Électronique' }
          ]
        },
        'tech-sociale': {
          label: 'Sociale',
          icon: '🌸',
          options: [
            { val: 'nutrition',       text: 'Nutrition-Alimentation' },
            { val: 'puericulture',    text: 'Puériculture' },
            { val: 'coupe-couture',   text: 'Coupe et Couture' },
            { val: 'esthetique',      text: 'Esthétique' }
          ]
        },
        'tech-medicale': {
          label: 'Médicale',
          icon: '🏥',
          options: [
            { val: 'nursing',         text: 'Nursing (Soins Infirmiers)' },
            { val: 'accoucheuse',     text: 'Accoucheuse' }
          ]
        },
        'tech-agricole': {
          label: 'Agricole',
          icon: '🌾',
          options: [
            { val: 'agriculture',     text: 'Agriculture' },
            { val: 'elevage',         text: 'Élevage' },
            { val: 'peche',           text: 'Pêche et Pisciculture' }
          ]
        }
      }
    }
  };

  // ─────────────────────────────────────────────
  // STYLE GLOBAL INJECTÉ (animations + cartes)
  // ─────────────────────────────────────────────
  if (!document.getElementById('insc-orientation-style')) {
    var style = document.createElement('style');
    style.id = 'insc-orientation-style';
    style.textContent = [
      '@keyframes fadeSlideIn {',
      '  from { opacity:0; transform:translateY(10px); }',
      '  to   { opacity:1; transform:translateY(0); }',
      '}',
      '.orient-card {',
      '  display:flex; align-items:center; gap:14px;',
      '  padding:18px 20px; border-radius:16px;',
      '  border:2px solid transparent; cursor:pointer;',
      '  transition:all .22s ease; user-select:none;',
      '  background:#fff; box-shadow:0 1px 4px rgba(0,0,0,.06);',
      '}',
      '.orient-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.1); }',
      '.orient-card.selected { box-shadow:0 6px 24px rgba(0,0,0,.14); }',
      '.orient-card .card-icon { font-size:26px; line-height:1; }',
      '.orient-card .card-title { font-size:14px; font-weight:700; color:#1e1b4b; }',
      '.orient-card .card-sub   { font-size:11px; color:#6b7280; margin-top:2px; }',
      '.sous-section-chip {',
      '  display:flex; align-items:center; gap:8px; padding:12px 16px;',
      '  border-radius:12px; border:1.5px solid #e5e7eb; cursor:pointer;',
      '  background:#fff; transition:all .18s ease; user-select:none;',
      '  font-size:13px; font-weight:600; color:#374151;',
      '}',
      '.sous-section-chip:hover { border-color:#6366f1; color:#4f46e5; background:#f5f3ff; }',
      '.sous-section-chip.selected { border-color:#4f46e5; background:#eef2ff; color:#4f46e5; }',
      '.sous-section-chip.selected-tech { border-color:#d97706; background:#fffbeb; color:#b45309; }',
      '.orient-appear { animation: fadeSlideIn .3s ease both; }',
      '.option-select-premium {',
      '  width:100%; padding:14px 18px; background:#fff;',
      '  border:2px solid #e5e7eb; border-radius:14px; font-size:13px;',
      '  color:#111827; font-weight:600; outline:none; cursor:pointer;',
      '  transition:border-color .2s ease, box-shadow .2s ease;',
      '  appearance:none; -webkit-appearance:none;',
      '  background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E");',
      '  background-repeat:no-repeat; background-position:right 14px center;',
      '  padding-right:42px;',
      '}',
      '.option-select-premium:focus { border-color:#4f46e5; box-shadow:0 0 0 3px rgba(99,102,241,.15); }',
      '.progress-dots { display:flex; gap:6px; align-items:center; }',
      '.progress-dots span {',
      '  width:8px; height:8px; border-radius:50%;',
      '  background:#e5e7eb; transition:all .2s;',
      '}',
      '.progress-dots span.active { background:#4f46e5; transform:scale(1.3); }',
      '.progress-dots span.done  { background:#10b981; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────────
  // BLOC PHOTO PARTAGÉ
  // ─────────────────────────────────────────────
  var tplPhoto = ''
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">Photo du Candidat</h3>'
    +   '<div class="flex items-start gap-6 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-300">'
    +     '<div class="shrink-0">'
    +       '<div id="photo-preview" class="w-28 h-32 rounded-xl bg-white border-2 border-gray-200 flex flex-col items-center justify-center overflow-hidden shadow-sm">'
    +         '<svg class="w-10 h-10 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
    +         '<span style="font-size:10px;color:#9ca3af;font-weight:500;">Aperçu</span>'
    +       '</div>'
    +     '</div>'
    +     '<div class="flex-1 space-y-2">'
    +       '<label class="block text-sm font-semibold text-gray-700">Photo d\'identité du candidat</label>'
    +       '<p class="text-xs text-gray-500">Format : JPG, PNG, WEBP &nbsp;·&nbsp; Max <strong>5 Mo</strong></p>'
    +       '<label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;padding:10px 16px;border-radius:12px;background:#fff;border:1.5px solid #d1d5db;box-shadow:0 1px 3px rgba(0,0,0,.07);transition:all .18s;font-size:13px;font-weight:600;color:#374151;">'
    +         '<svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    +         'Choisir une photo'
    +         '<input type="file" id="photo-input" accept="image/jpeg,image/png,image/webp" style="display:none;">'
    +       '</label>'
    +       '<p id="photo-error" style="display:none;font-size:11px;color:#ef4444;font-weight:500;">⚠ La photo dépasse 5 Mo. Choisissez un fichier plus léger.</p>'
    +       '<p id="photo-name" style="display:none;font-size:11px;color:#10b981;font-weight:600;"></p>'
    +     '</div>'
    +   '</div>'
    + '</div>';

  // ─────────────────────────────────────────────
  // BLOC FILIATION PARTAGÉ
  // ─────────────────────────────────────────────
  var tplFiliation = function (color) {
    return ''
      + '<div class="space-y-4">'
      +   '<h3 class="text-sm font-bold uppercase tracking-wider border-b border-gray-200 pb-2" style="color:' + color + '">Filiation (Parents)</h3>'
      +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">'
      +     '<div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">'
      +       '<h4 style="font-size:12px;font-weight:700;color:#374151;display:flex;align-items:center;gap:6px;">'
      +         '<span style="width:20px;height:20px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#2563eb;">P</span>'
      +         'Informations du Père'
      +       '</h4>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom du Père *</label><input type="text" required class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" placeholder="+243..." required class="input-field phone-input"></div>'
      +     '</div>'
      +     '<div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">'
      +       '<h4 style="font-size:12px;font-weight:700;color:#374151;display:flex;align-items:center;gap:6px;">'
      +         '<span style="width:20px;height:20px;border-radius:50%;background:#fce7f3;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#db2777;">M</span>'
      +         'Informations de la Mère'
      +       '</h4>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom de la Mère *</label><input type="text" required class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" placeholder="+243..." required class="input-field phone-input"></div>'
      +     '</div>'
      +   '</div>'
      +   '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Adresse e-mail des parents</label><input type="email" class="input-field"></div>'
      + '</div>';
  };

  // ─────────────────────────────────────────────
  // BLOC ORIENTATION RETROUVAILLES (Premium)
  // ─────────────────────────────────────────────
  var tplOrientation = ''
    + '<div class="space-y-5" id="bloc-orientation">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">'
    +   '<h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;">Orientation Scolaire — EPST / RDC</h3>'
    +   '<div class="progress-dots" id="orient-progress">'
    +     '<span id="dot-classe"></span>'
    +     '<span id="dot-famille"></span>'
    +     '<span id="dot-sous"></span>'
    +     '<span id="dot-option"></span>'
    +   '</div>'
    + '</div>'

    // Classe
    + '<div id="step-classe">'
    +   '<label style="display:block;font-size:13px;font-weight:700;color:#111827;margin-bottom:8px;">① Classe Sollicitée *</label>'
    +   '<select id="select-classe-humanite" required class="option-select-premium">'
    +     '<option value="">— Sélectionnez une classe —</option>'
    +     '<optgroup label="Éducation de Base (EB)">'
    +       '<option value="7-eb">7ème Année de l\'Éducation de Base (7ème CTEB)</option>'
    +       '<option value="8-eb">8ème Année de l\'Éducation de Base (8ème CTEB)</option>'
    +     '</optgroup>'
    +     '<optgroup label="Humanités — Secondaire">'
    +       '<option value="1-hum">1ère Année des Humanités</option>'
    +       '<option value="2-hum">2ème Année des Humanités</option>'
    +       '<option value="3-hum">3ème Année des Humanités</option>'
    +       '<option value="4-hum">4ème Année des Humanités (Terminale)</option>'
    +     '</optgroup>'
    +   '</select>'
    + '</div>'

    // Choix Famille (affiché si ≥ 1ère Hum)
    + '<div id="step-famille" style="display:none;" class="orient-appear">'
    +   '<label style="display:block;font-size:13px;font-weight:700;color:#111827;margin-bottom:12px;">② Famille de Section *</label>'
    +   '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    +     '<div class="orient-card" id="card-non-technique" data-famille="non-technique"'
    +       ' style="border-color:#c7d2fe;background:#eef2ff;">'
    +       '<span class="card-icon">📚</span>'
    +       '<div>'
    +         '<div class="card-title" style="color:#3730a3;">Section Non Technique</div>'
    +         '<div class="card-sub">Sciences · Littéraire · Pédagogie</div>'
    +       '</div>'
    +     '</div>'
    +     '<div class="orient-card" id="card-technique" data-famille="technique"'
    +       ' style="border-color:#fde68a;background:#fffbeb;">'
    +       '<span class="card-icon">⚙️</span>'
    +       '<div>'
    +         '<div class="card-title" style="color:#92400e;">Section Technique</div>'
    +         '<div class="card-sub">Commerciale · Industrielle · Sociale · Médicale · Agricole</div>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</div>'

    // Sous-sections (affiché après choix famille)
    + '<div id="step-sous-section" style="display:none;" class="orient-appear">'
    +   '<label style="display:block;font-size:13px;font-weight:700;color:#111827;margin-bottom:12px;">③ Sous-Section *</label>'
    +   '<div id="chips-sous-section" style="display:flex;flex-wrap:wrap;gap:10px;"></div>'
    + '</div>'

    // Option finale
    + '<div id="step-option" style="display:none;" class="orient-appear">'
    +   '<label style="display:block;font-size:13px;font-weight:700;color:#111827;margin-bottom:8px;">④ Option *</label>'
    +   '<div id="option-badge" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f3f4f6;border-radius:20px;font-size:11px;font-weight:600;color:#6b7280;margin-bottom:10px;"></div>'
    +   '<select id="select-option-final" required class="option-select-premium">'
    +     '<option value="">— Sélectionnez l\'option —</option>'
    +   '</select>'
    + '</div>'

    + '</div>'; // fin bloc-orientation

  // ─────────────────────────────────────────────
  // TEMPLATES COMPLETS
  // ─────────────────────────────────────────────
  var identiteBlock = function (color) {
    return ''
      + '<div class="space-y-4">'
      +   '<h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #f3f4f6;padding-bottom:10px;color:' + color + '">Identité de l\'Élève</h3>'
      +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom *</label><input type="text" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Postnom *</label><input type="text" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Prénom *</label><input type="text" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Sexe *</label>'
      +       '<select required class="input-field"><option value="">Sélectionner</option><option value="M">Masculin</option><option value="F">Féminin</option></select>'
      +     '</div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Date de naissance *</label><input type="date" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Lieu de naissance *</label><input type="text" required class="input-field"></div>'
      +   '</div>'
      + '</div>';
  };

  var adresseBlock = function (color, avecDistrict) {
    var districtHtml = avecDistrict
      ? '<div><label class="block text-xs font-semibold text-gray-500 mb-1">District / Territoire *</label><input type="text" required class="input-field"></div>'
      : '';
    return ''
      + '<div class="space-y-4">'
      +   '<h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #f3f4f6;padding-bottom:10px;color:' + color + '">Origine &amp; Adresse</h3>'
      +   '<div class="grid grid-cols-1 md:grid-cols-' + (avecDistrict ? '3' : '2') + ' gap-4 mb-4">'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nationalité *</label><input type="text" value="Congolaise (RDC)" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Province d\'origine *</label><input type="text" required class="input-field"></div>'
      +     districtHtml
      +   '</div>'
      +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Avenue &amp; Numéro *</label><input type="text" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Quartier *</label><input type="text" required class="input-field"></div>'
      +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Commune *</label><input type="text" required class="input-field"></div>'
      +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Ville *</label><input type="text" value="Kinshasa" required class="input-field"></div>'
      +   '</div>'
      + '</div>';
  };

  var tplHarmonie = ''
    + tplPhoto
    + identiteBlock('#1d4ed8')
    + adresseBlock('#1d4ed8', true)
    + tplFiliation('#1d4ed8')
    + '<div class="space-y-4">'
    +   '<h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #f3f4f6;padding-bottom:10px;color:#1d4ed8;">Cursus Scolaire</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance</label><input type="text" class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Province de l\'école</label><input type="text" class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Pourcentage / Mention</label><input type="text" class="input-field"></div>'
    +   '</div>'
    +   '<div style="padding:20px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:16px;">'
    +     '<label style="display:block;font-size:13px;font-weight:700;color:#1e40af;margin-bottom:10px;">Classe Sollicitée *</label>'
    +     '<select required class="option-select-premium" style="border-color:#93c5fd;">'
    +       '<option value="">— Sélectionnez une classe —</option>'
    +       '<optgroup label="Maternelle"><option value="accueil">Accueil</option><option value="mat-1">1ère Maternelle</option><option value="mat-2">2ème Maternelle</option><option value="mat-3">3ème Maternelle</option></optgroup>'
    +       '<optgroup label="Primaire"><option value="prim-1">1ère Année Primaire</option><option value="prim-2">2ème Année Primaire</option><option value="prim-3">3ème Année Primaire</option><option value="prim-4">4ème Année Primaire</option><option value="prim-5">5ème Année Primaire</option><option value="prim-6">6ème Année Primaire</option></optgroup>'
    +     '</select>'
    +   '</div>'
    + '</div>';

  var tplRetrouvailles = ''
    + tplPhoto
    + identiteBlock('#dc2626')
    + adresseBlock('#dc2626', false)
    + tplFiliation('#dc2626')
    + '<div class="space-y-4">'
    +   '<h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #f3f4f6;padding-bottom:10px;color:#dc2626;">Cursus Scolaire</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Code de l\'école d\'origine</label><input type="text" class="input-field"></div>'
    +   '</div>'
    +   '<div style="padding:16px;background:#f9fafb;border:1.5px dashed #d1d5db;border-radius:14px;">'
    +     '<label class="block text-xs font-semibold text-gray-700 mb-2">Pièces jointes (Bulletins, Attestation de passation)</label>'
    +     '<input type="file" multiple class="block w-full text-sm text-gray-500 cursor-pointer">'
    +   '</div>'
    + '</div>'
    + tplOrientation;

  var templates = { harmonie: tplHarmonie, retrouvailles: tplRetrouvailles };

  // ─────────────────────────────────────────────
  // LOGIQUE ORIENTATION PREMIUM
  // ─────────────────────────────────────────────
  function updateDots(step) {
    // step: 1=classe, 2=famille, 3=sous, 4=option
    var dots = ['dot-classe','dot-famille','dot-sous','dot-option'];
    dots.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      el.className = '';
      if (i + 1 < step)  el.classList.add('done');
      if (i + 1 === step) el.classList.add('active');
    });
  }

  function resetFrom(step) {
    if (step <= 2) {
      var sf = document.getElementById('step-famille');
      if (sf) sf.style.display = 'none';
      // deselect cards
      ['card-non-technique','card-technique'].forEach(function(id) {
        var c = document.getElementById(id);
        if (c) { c.classList.remove('selected'); }
      });
    }
    if (step <= 3) {
      var ss = document.getElementById('step-sous-section');
      if (ss) ss.style.display = 'none';
      var chips = document.getElementById('chips-sous-section');
      if (chips) chips.innerHTML = '';
    }
    if (step <= 4) {
      var so = document.getElementById('step-option');
      if (so) so.style.display = 'none';
      var sel = document.getElementById('select-option-final');
      if (sel) sel.innerHTML = '<option value="">— Sélectionnez l\'option —</option>';
      var badge = document.getElementById('option-badge');
      if (badge) badge.innerHTML = '';
    }
  }

  function setupOrientation() {
    var selectClasse = document.getElementById('select-classe-humanite');
    if (!selectClasse) return;

    updateDots(1);

    selectClasse.addEventListener('change', function () {
      resetFrom(2);
      var val = selectClasse.value;
      if (!val) { updateDots(1); return; }
      updateDots(2);
      if (val.indexOf('hum') !== -1) {
        var sf = document.getElementById('step-famille');
        sf.style.display = 'block';
        sf.classList.add('orient-appear');
      }
    });

    // Cartes Famille
    ['card-non-technique','card-technique'].forEach(function(cardId) {
      var card = document.getElementById(cardId);
      if (!card) return;
      card.addEventListener('click', function () {
        resetFrom(3);
        // Marquer sélection
        ['card-non-technique','card-technique'].forEach(function(cid) {
          var c = document.getElementById(cid);
          if (c) c.classList.remove('selected');
        });
        card.classList.add('selected');

        var famille = card.getAttribute('data-famille');
        var data    = orientationData[famille];
        updateDots(3);

        // Générer chips sous-sections
        var chipsContainer = document.getElementById('chips-sous-section');
        chipsContainer.innerHTML = '';
        Object.keys(data.sousSections).forEach(function(ssKey) {
          var ss   = data.sousSections[ssKey];
          var chip = document.createElement('div');
          chip.className = 'sous-section-chip';
          chip.setAttribute('data-ss', ssKey);
          chip.setAttribute('data-famille', famille);
          chip.innerHTML = '<span style="font-size:18px;">' + ss.icon + '</span><span>' + ss.label + '</span>';
          chip.addEventListener('click', function () {
            // Deselect others
            chipsContainer.querySelectorAll('.sous-section-chip').forEach(function(c) {
              c.classList.remove('selected','selected-tech');
            });
            chip.classList.add(famille === 'technique' ? 'selected-tech' : 'selected');

            // Afficher options
            var options = ss.options;
            var selOpt  = document.getElementById('select-option-final');
            selOpt.innerHTML = '<option value="">— Sélectionnez l\'option —</option>';
            options.forEach(function(opt) {
              var o = document.createElement('option');
              o.value = opt.val; o.textContent = opt.text;
              selOpt.appendChild(o);
            });

            var badge = document.getElementById('option-badge');
            badge.innerHTML = ss.icon + ' ' + ss.label;

            var stepOpt = document.getElementById('step-option');
            stepOpt.style.display = 'block';
            stepOpt.classList.add('orient-appear');
            updateDots(4);
          });
          chipsContainer.appendChild(chip);
        });

        var stepSS = document.getElementById('step-sous-section');
        stepSS.style.display = 'block';
        stepSS.classList.add('orient-appear');
      });
    });
  }

  // ─────────────────────────────────────────────
  // PHOTO UPLOAD
  // ─────────────────────────────────────────────
  function setupPhotoUpload() {
    var photoInput   = document.getElementById('photo-input');
    var photoPreview = document.getElementById('photo-preview');
    var photoError   = document.getElementById('photo-error');
    var photoName    = document.getElementById('photo-name');
    if (!photoInput) return;

    photoInput.addEventListener('change', function () {
      photoError.style.display = 'none';
      photoName.style.display  = 'none';
      var file = photoInput.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        photoError.style.display = 'block';
        photoInput.value = '';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (ev) {
        photoPreview.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;" alt="Photo candidat">';
      };
      reader.readAsDataURL(file);
      photoName.textContent = '✔ ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
      photoName.style.display = 'block';
    });
  }

  // ─────────────────────────────────────────────
  // SETUP GÉNÉRAL APRÈS INJECTION
  // ─────────────────────────────────────────────
  function setupInputs() {
    document.querySelectorAll('.input-field').forEach(function (el) {
      el.style.cssText = 'width:100%;padding:12px 16px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;font-size:13px;transition:all .18s;outline:none;';
      el.addEventListener('focus', function(){ el.style.borderColor='#6366f1'; el.style.background='#fff'; el.style.boxShadow='0 0 0 3px rgba(99,102,241,.12)'; });
      el.addEventListener('blur',  function(){ el.style.borderColor='#e5e7eb'; el.style.background='#f9fafb'; el.style.boxShadow='none'; });
    });

    document.querySelectorAll('.phone-input').forEach(function (input) {
      input.addEventListener('focus', function () { if (!input.value) input.value = '+243'; });
      input.addEventListener('input', function () {
        if (!input.value.startsWith('+243')) {
          input.value = '+243' + input.value.replace(/[^0-9]/g, '');
        }
      });
      input.addEventListener('keypress', function (e) {
        if (!/[0-9+]/.test(e.key)) e.preventDefault();
      });
    });

    setupPhotoUpload();
    setupOrientation();
  }

  // ─────────────────────────────────────────────
  // INSTITUTION CHOICE
  // ─────────────────────────────────────────────
  institutionRadios.forEach(function (radio) {
    radio.addEventListener('change', function (e) {
      currentInstitution = e.target.value;
      stepDemarche.classList.remove('hidden');
      form.classList.remove('hidden');
      dynamicFieldsContainer.innerHTML = templates[currentInstitution];
      setupInputs();
    });
  });

  // ─────────────────────────────────────────────
  // DÉMARCHE TOGGLE
  // ─────────────────────────────────────────────
  demarcheRadios.forEach(function (radio) {
    radio.addEventListener('change', function (e) {
      currentDemarche = e.target.value;
      var mat = document.getElementById('matricule');
      if (currentDemarche === 'reinscription') {
        matriculeContainer.classList.remove('hidden');
        if (mat) mat.setAttribute('required', 'required');
      } else {
        matriculeContainer.classList.add('hidden');
        if (mat) mat.removeAttribute('required');
      }
    });
  });

  // ─────────────────────────────────────────────
  // SOUMISSION
  // ─────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formErrors.classList.add('hidden');
    var invalids = form.querySelectorAll(':invalid');
    if (invalids.length > 0) {
      formErrorsText.textContent = 'Veuillez corriger les champs invalides. Le numéro de téléphone doit commencer par +243.';
      formErrors.classList.remove('hidden');
      invalids[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    btnSubmit.disabled = true;
    btnSubmitText.textContent = 'Envoi en cours...';
    btnSubmitSpinner.classList.remove('hidden');
    setTimeout(function () {
      btnSubmit.disabled = false;
      btnSubmitSpinner.classList.add('hidden');
      btnSubmitText.textContent = "Soumettre le dossier d'inscription";
      alert('Félicitations ! Votre dossier a été soumis avec succès.');
      form.reset();
      stepDemarche.classList.add('hidden');
      form.classList.add('hidden');
      institutionRadios.forEach(function (r) { r.checked = false; });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  });
});
