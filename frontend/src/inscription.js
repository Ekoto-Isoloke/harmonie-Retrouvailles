// Inscription Logic

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('inscription-form');
  var dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
  var institutionRadios = document.querySelectorAll('input[name="institution"]');
  var demarcheRadios = document.querySelectorAll('input[name="demarche"]');
  var stepDemarche = document.getElementById('step-demarche');
  var matriculeContainer = document.getElementById('matricule-container');
  var btnSubmit = document.getElementById('btn-submit');
  var btnSubmitText = document.getElementById('btn-submit-text');
  var btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  var formErrors = document.getElementById('form-errors');
  var formErrorsText = document.getElementById('form-errors-text');

  var currentInstitution = null;
  var currentDemarche = 'nouvelle';

  // -----------------------------------------------
  // Bloc photo partagé (identique Harmonie & Retrouvailles)
  // -----------------------------------------------
  var tplPhoto = ''
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">Photo du Candidat</h3>'
    +   '<div class="flex items-start gap-6 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-300">'
    +     '<div id="photo-preview-wrap" class="shrink-0">'
    +       '<div id="photo-preview" class="w-28 h-32 rounded-xl bg-white border-2 border-gray-200 flex flex-col items-center justify-center overflow-hidden shadow-sm">'
    +         '<svg class="w-10 h-10 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
    +         '<span class="text-[10px] text-gray-400 font-medium">Aperçu</span>'
    +       '</div>'
    +     '</div>'
    +     '<div class="flex-1 space-y-2">'
    +       '<label class="block text-sm font-semibold text-gray-700">Photo d\'identité du candidat</label>'
    +       '<p class="text-xs text-gray-500">Format accepté : JPG, PNG, WEBP. Taille maximale : <strong>5 Mo</strong>.</p>'
    +       '<label class="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 shadow-sm transition-all">'
    +         '<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    +         '<span class="text-sm text-gray-600 font-medium">Choisir une photo</span>'
    +         '<input type="file" id="photo-input" accept="image/jpeg,image/png,image/webp" class="sr-only">'
    +       '</label>'
    +       '<p id="photo-error" class="hidden text-xs text-red-500 font-medium">La photo dépasse 5 Mo. Veuillez choisir un fichier plus léger.</p>'
    +       '<p id="photo-name" class="text-xs text-emerald-600 font-medium hidden"></p>'
    +     '</div>'
    +   '</div>'
    + '</div>';

  // -----------------------------------------------
  // Bloc Filiation Père + Mère partagé
  // -----------------------------------------------
  var tplFiliation = function (colorClass) {
    return ''
      + '<div class="space-y-4">'
      +   '<h3 class="text-sm font-bold uppercase tracking-wider ' + colorClass + ' border-b border-gray-200 pb-2">Filiation (Parents)</h3>'
      +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">'
      +     '<div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">'
      +       '<h4 class="text-xs font-bold text-gray-700 flex items-center gap-1.5">'
      +         '<span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">P</span>'
      +         'Informations du Père'
      +       '</h4>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom du Père *</label><input type="text" required class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>'
      +       '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" placeholder="+243..." required class="input-field phone-input"></div>'
      +     '</div>'
      +     '<div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">'
      +       '<h4 class="text-xs font-bold text-gray-700 flex items-center gap-1.5">'
      +         '<span class="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] font-bold">M</span>'
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

  // -----------------------------------------------
  // Template HARMONIE
  // -----------------------------------------------
  var tplHarmonie = ''
    // Photo
    + tplPhoto

    // Identité
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Identité de l\'Élève</h3>'
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
    + '</div>'

    // Origine & Adresse
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Origine &amp; Adresse</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nationalité *</label><input type="text" value="Congolaise (RDC)" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Province d\'origine *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">District / Territoire *</label><input type="text" required class="input-field"></div>'
    +   '</div>'
    +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
    +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Avenue &amp; Numéro *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Quartier *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Commune *</label><input type="text" required class="input-field"></div>'
    +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Ville *</label><input type="text" value="Kinshasa" required class="input-field"></div>'
    +   '</div>'
    + '</div>'

    // Filiation
    + tplFiliation('text-primary-800')

    // Cursus
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Cursus Scolaire</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance</label><input type="text" class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Province de l\'école</label><input type="text" class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Pourcentage / Mention</label><input type="text" class="input-field"></div>'
    +   '</div>'
    +   '<div class="p-5 bg-primary-50 border border-primary-200 rounded-xl">'
    +     '<label class="block text-sm font-bold text-primary-900 mb-2">Classe Sollicitée *</label>'
    +     '<select required class="w-full px-4 py-3 bg-white border border-primary-300 rounded-xl text-sm outline-none">'
    +       '<option value="">-- Sélectionnez une classe --</option>'
    +       '<optgroup label="Maternelle">'
    +         '<option value="accueil">Accueil</option>'
    +         '<option value="mat-1">1ère Maternelle</option>'
    +         '<option value="mat-2">2ème Maternelle</option>'
    +         '<option value="mat-3">3ème Maternelle</option>'
    +       '</optgroup>'
    +       '<optgroup label="Primaire">'
    +         '<option value="prim-1">1ère Année Primaire</option>'
    +         '<option value="prim-2">2ème Année Primaire</option>'
    +         '<option value="prim-3">3ème Année Primaire</option>'
    +         '<option value="prim-4">4ème Année Primaire</option>'
    +         '<option value="prim-5">5ème Année Primaire</option>'
    +         '<option value="prim-6">6ème Année Primaire</option>'
    +       '</optgroup>'
    +     '</select>'
    +   '</div>'
    + '</div>';

  // -----------------------------------------------
  // Template RETROUVAILLES
  // -----------------------------------------------
  var tplRetrouvailles = ''
    // Photo
    + tplPhoto

    // Identité
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Identité de l\'Élève</h3>'
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
    + '</div>'

    // Origine & Adresse
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Origine &amp; Adresse</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Nationalité *</label><input type="text" value="Congolaise (RDC)" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Province d\'origine *</label><input type="text" required class="input-field"></div>'
    +   '</div>'
    +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
    +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Avenue &amp; Numéro *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Quartier *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Commune *</label><input type="text" required class="input-field"></div>'
    +     '<div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Ville *</label><input type="text" value="Kinshasa" required class="input-field"></div>'
    +   '</div>'
    + '</div>'

    // Filiation identique à Harmonie
    + tplFiliation('text-secondary-600')

    // Cursus
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Cursus Scolaire</h3>'
    +   '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance *</label><input type="text" required class="input-field"></div>'
    +     '<div><label class="block text-xs font-semibold text-gray-500 mb-1">Code de l\'école d\'origine</label><input type="text" class="input-field"></div>'
    +   '</div>'
    +   '<div class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">'
    +     '<label class="block text-xs font-semibold text-gray-700 mb-2">Pièces jointes (Bulletins, Attestation de passation)</label>'
    +     '<input type="file" multiple class="block w-full text-sm text-gray-500 cursor-pointer">'
    +   '</div>'
    + '</div>'

    // Orientation Scolaire
    + '<div class="space-y-4">'
    +   '<h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Orientation Scolaire</h3>'
    +   '<div class="p-5 bg-red-50 border border-red-200 rounded-xl space-y-4">'
    +     '<div>'
    +       '<label class="block text-sm font-bold text-red-900 mb-2">Classe Sollicitée *</label>'
    +       '<select id="select-classe-humanite" required class="w-full px-4 py-3 bg-white border border-red-300 rounded-xl text-sm outline-none">'
    +         '<option value="">-- Sélectionnez une classe --</option>'
    +         '<optgroup label="Éducation de Base">'
    +           '<option value="7-eb">7ème Année de l\'Éducation de Base (7ème CTEB)</option>'
    +           '<option value="8-eb">8ème Année de l\'Éducation de Base (8ème CTEB)</option>'
    +         '</optgroup>'
    +         '<optgroup label="Humanités (Secondaire)">'
    +           '<option value="1-hum">1ère Année des Humanités (ex-3ème)</option>'
    +           '<option value="2-hum">2ème Année des Humanités (ex-4ème)</option>'
    +           '<option value="3-hum">3ème Année des Humanités (ex-5ème)</option>'
    +           '<option value="4-hum">4ème Année des Humanités (ex-6ème)</option>'
    +         '</optgroup>'
    +       '</select>'
    +     '</div>'
    +     '<div id="container-section" class="hidden">'
    +       '<label class="block text-sm font-bold text-red-900 mb-2">Section *</label>'
    +       '<select id="select-section" class="w-full px-4 py-3 bg-white border border-red-300 rounded-xl text-sm outline-none">'
    +         '<option value="">-- Sélectionnez la section --</option>'
    +         '<option value="sciences">Sciences</option>'
    +         '<option value="litteraire">Littéraire</option>'
    +         '<option value="pedagogie">Pédagogie</option>'
    +         '<option value="technique">Technique</option>'
    +       '</select>'
    +     '</div>'
    +     '<div id="container-option" class="hidden">'
    +       '<label class="block text-sm font-bold text-red-900 mb-2">Option *</label>'
    +       '<select id="select-option" class="w-full px-4 py-3 bg-white border border-red-300 rounded-xl text-sm outline-none">'
    +         '<option value="">-- Sélectionnez l\'option --</option>'
    +       '</select>'
    +     '</div>'
    +   '</div>'
    + '</div>';

  var templates = {
    harmonie: tplHarmonie,
    retrouvailles: tplRetrouvailles
  };

  var optionsMap = {
    sciences:   [{ val: 'math-physique', text: 'Math-Physique' }, { val: 'chimie-biologie', text: 'Chimie-Biologie' }],
    litteraire: [{ val: 'latin-philo', text: 'Latin-Philosophie' }],
    pedagogie:  [{ val: 'pedagogie-generale', text: 'Pédagogie Générale' }],
    technique:  [
      { val: 'commerciale-gestion', text: 'Commerciale et Gestion' },
      { val: 'coupe-couture', text: 'Coupe et Couture' },
      { val: 'electricite', text: 'Électricité' },
      { val: 'mecanique', text: 'Mécanique Générale' }
    ]
  };

  // -----------------------------------------------
  // Setup photo upload (5 Mo max)
  // -----------------------------------------------
  function setupPhotoUpload() {
    var photoInput   = document.getElementById('photo-input');
    var photoPreview = document.getElementById('photo-preview');
    var photoError   = document.getElementById('photo-error');
    var photoName    = document.getElementById('photo-name');

    if (!photoInput) return;

    photoInput.addEventListener('change', function () {
      photoError.classList.add('hidden');
      photoName.classList.add('hidden');

      var file = photoInput.files[0];
      if (!file) return;

      // Vérification taille 5 Mo
      if (file.size > 5 * 1024 * 1024) {
        photoError.classList.remove('hidden');
        photoInput.value = '';
        return;
      }

      // Aperçu
      var reader = new FileReader();
      reader.onload = function (ev) {
        photoPreview.innerHTML = '<img src="' + ev.target.result + '" class="w-full h-full object-cover" alt="Photo candidat">';
      };
      reader.readAsDataURL(file);

      photoName.textContent = '✔ ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
      photoName.classList.remove('hidden');
    });
  }

  // -----------------------------------------------
  // Setup inputs après injection
  // -----------------------------------------------
  function setupInputs() {
    document.querySelectorAll('.input-field').forEach(function (el) {
      el.classList.add(
        'w-full', 'px-4', 'py-3', 'bg-gray-50', 'border', 'border-gray-200',
        'rounded-xl', 'text-sm', 'transition-all', 'outline-none'
      );
    });

    // Téléphone : préfixe +243
    document.querySelectorAll('.phone-input').forEach(function (input) {
      input.addEventListener('focus', function () {
        if (!input.value) input.value = '+243';
      });
      input.addEventListener('input', function () {
        if (!input.value.startsWith('+243')) {
          input.value = '+243' + input.value.replace(/[^0-9]/g, '');
        }
      });
      input.addEventListener('keypress', function (e) {
        if (!/[0-9+]/.test(e.key)) e.preventDefault();
      });
    });

    // Cascades Humanités
    var selectClasse  = document.getElementById('select-classe-humanite');
    var selectSection = document.getElementById('select-section');
    var selectOption  = document.getElementById('select-option');
    var ctnSection    = document.getElementById('container-section');
    var ctnOption     = document.getElementById('container-option');

    if (selectClasse) {
      selectClasse.addEventListener('change', function () {
        if (selectClasse.value.indexOf('hum') !== -1) {
          ctnSection.classList.remove('hidden');
          selectSection.setAttribute('required', 'required');
        } else {
          ctnSection.classList.add('hidden');
          ctnOption.classList.add('hidden');
          selectSection.removeAttribute('required');
          selectOption.removeAttribute('required');
          selectSection.value = '';
          selectOption.value  = '';
        }
      });
    }

    if (selectSection) {
      selectSection.addEventListener('change', function () {
        var val = selectSection.value;
        if (val && optionsMap[val]) {
          ctnOption.classList.remove('hidden');
          selectOption.setAttribute('required', 'required');
          selectOption.innerHTML = '<option value="">-- Sélectionnez l\'option --</option>';
          optionsMap[val].forEach(function (opt) {
            var o = document.createElement('option');
            o.value       = opt.val;
            o.textContent = opt.text;
            selectOption.appendChild(o);
          });
        } else {
          ctnOption.classList.add('hidden');
          selectOption.removeAttribute('required');
          selectOption.innerHTML = '<option value="">-- Sélectionnez l\'option --</option>';
        }
      });
    }

    // Photo
    setupPhotoUpload();
  }

  // -----------------------------------------------
  // Choix institution
  // -----------------------------------------------
  institutionRadios.forEach(function (radio) {
    radio.addEventListener('change', function (e) {
      currentInstitution = e.target.value;
      stepDemarche.classList.remove('hidden');
      form.classList.remove('hidden');
      dynamicFieldsContainer.innerHTML = templates[currentInstitution];
      setupInputs();
    });
  });

  // -----------------------------------------------
  // Toggle Démarche
  // -----------------------------------------------
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

  // -----------------------------------------------
  // Soumission
  // -----------------------------------------------
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
