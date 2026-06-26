// Inscription Logic

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inscription-form');
  const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
  const institutionRadios = document.querySelectorAll('input[name="institution"]');
  const demarcheRadios = document.querySelectorAll('input[name="demarche"]');
  const stepDemarche = document.getElementById('step-demarche');
  const matriculeContainer = document.getElementById('matricule-container');
  const btnSubmit = document.getElementById('btn-submit');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  const formErrors = document.getElementById('form-errors');
  const formErrorsText = document.getElementById('form-errors-text');

  // State
  let currentInstitution = null;
  let currentDemarche = 'nouvelle';

  // Templates for dynamic sections
  const templates = {
    harmonie: `
      <!-- Identité -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Identité de l'Élève</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Postnom *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Prénom *</label><input type="text" required class="input-field"></div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Sexe *</label>
            <select required class="input-field">
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Date de naissance *</label><input type="date" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Lieu de naissance *</label><input type="text" required class="input-field"></div>
        </div>
      </div>

      <!-- Origine & Adresse -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Origine & Adresse</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nationalité *</label><input type="text" value="Congolaise (RDC)" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Province d'origine *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">District/Territoire *</label><input type="text" required class="input-field"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Avenue & Numéro *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Quartier *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Commune *</label><input type="text" required class="input-field"></div>
          <div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Ville *</label><input type="text" value="Kinshasa" required class="input-field"></div>
        </div>
      </div>

      <!-- Filiation -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Filiation (Parents)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 class="text-xs font-bold text-gray-700">Informations du Père</h4>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom du Père *</label><input type="text" required class="input-field"></div>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" pattern="\\+243[0-9]{9}" placeholder="+243..." required class="input-field phone-input"></div>
          </div>
          <div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 class="text-xs font-bold text-gray-700">Informations de la Mère</h4>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom de la Mère *</label><input type="text" required class="input-field"></div>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>
            <div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" pattern="\\+243[0-9]{9}" placeholder="+243..." required class="input-field phone-input"></div>
          </div>
        </div>
        <div><label class="block text-xs font-semibold text-gray-500 mb-1">Adresse e-mail des parents</label><input type="email" class="input-field"></div>
      </div>

      <!-- Cursus Scolaire & Choix de la Classe -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-gray-200 pb-2">Cursus Scolaire</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance</label><input type="text" class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Province de l'école</label><input type="text" class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Pourcentage obtenu (%)</label><input type="number" min="0" max="100" class="input-field"></div>
        </div>

        <div class="p-5 bg-primary-50 border border-primary-200 rounded-xl">
          <label class="block text-sm font-bold text-primary-900 mb-2">Classe Sollicitée (Maternelle & Primaire) *</label>
          <select required class="w-full px-4 py-3 bg-white border border-primary-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="">-- Sélectionnez une classe --</option>
            <optgroup label="Maternelle">
              <option value="accueil">Accueil</option>
              <option value="mat-1">1ère Maternelle</option>
              <option value="mat-2">2ème Maternelle</option>
              <option value="mat-3">3ème Maternelle</option>
            </optgroup>
            <optgroup label="Primaire">
              <option value="prim-1">1ère Année Primaire</option>
              <option value="prim-2">2ème Année Primaire</option>
              <option value="prim-3">3ème Année Primaire</option>
              <option value="prim-4">4ème Année Primaire</option>
              <option value="prim-5">5ème Année Primaire</option>
              <option value="prim-6">6ème Année Primaire</option>
            </optgroup>
          </select>
        </div>
      </div>
    `,
    retrouvailles: `
      <!-- Identité -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Identité de l'Élève</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Postnom *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Prénom *</label><input type="text" required class="input-field"></div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Sexe *</label>
            <select required class="input-field">
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Date de naissance *</label><input type="date" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Lieu de naissance *</label><input type="text" required class="input-field"></div>
        </div>
      </div>

      <!-- Origine & Adresse -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Origine & Adresse</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nationalité *</label><input type="text" value="Congolaise (RDC)" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Province d'origine *</label><input type="text" required class="input-field"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Avenue & Numéro *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Quartier *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Commune *</label><input type="text" required class="input-field"></div>
          <div class="md:col-span-2"><label class="block text-xs font-semibold text-gray-500 mb-1">Ville *</label><input type="text" value="Kinshasa" required class="input-field"></div>
        </div>
      </div>

      <!-- Filiation (Tuteur) -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Identité des Parents ou Tuteur</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Nom complet *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Profession</label><input type="text" class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label><input type="tel" pattern="\\+243[0-9]{9}" placeholder="+243..." required class="input-field phone-input"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Adresse e-mail</label><input type="email" class="input-field"></div>
        </div>
      </div>

      <!-- Cursus Scolaire -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Cursus Scolaire (Antécédents)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">École de provenance *</label><input type="text" required class="input-field"></div>
          <div><label class="block text-xs font-semibold text-gray-500 mb-1">Code de l'école d'origine</label><input type="text" class="input-field"></div>
        </div>
        <div class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <label class="block text-xs font-semibold text-gray-700 mb-2">Pièces jointes requises (Bulletins, Attestation)</label>
          <input type="file" multiple class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100 cursor-pointer">
        </div>
      </div>

      <!-- Orientation Scolaire (Humanités) -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-secondary-600 border-b border-gray-200 pb-2">Orientation Scolaire</h3>
        
        <div class="p-5 bg-secondary-50 border border-secondary-200 rounded-xl space-y-4">
          
          <div>
            <label class="block text-sm font-bold text-secondary-900 mb-2">Classe Sollicitée *</label>
            <select id="select-classe-humanite" required class="w-full px-4 py-3 bg-white border border-secondary-300 rounded-xl text-sm focus:ring-2 focus:ring-secondary-500 outline-none">
              <option value="">-- Sélectionnez une classe --</option>
              <optgroup label="Éducation de Base">
                <option value="7-eb">7ème Année de l'Éducation de Base (7ème CTEB)</option>
                <option value="8-eb">8ème Année de l'Éducation de Base (8ème CTEB)</option>
              </optgroup>
              <optgroup label="Humanités (Secondaire)">
                <option value="1-hum">1ère Année des Humanités (ex-3ème)</option>
                <option value="2-hum">2ème Année des Humanités (ex-4ème)</option>
                <option value="3-hum">3ème Année des Humanités (ex-5ème)</option>
                <option value="4-hum">4ème Année des Humanités (ex-6ème)</option>
              </optgroup>
            </select>
          </div>

          <div id="container-section" class="hidden">
            <label class="block text-sm font-bold text-secondary-900 mb-2">Section *</label>
            <select id="select-section" class="w-full px-4 py-3 bg-white border border-secondary-300 rounded-xl text-sm focus:ring-2 focus:ring-secondary-500 outline-none">
              <option value="">-- Sélectionnez la section --</option>
              <option value="sciences">Sciences</option>
              <option value="litteraire">Littéraire</option>
              <option value="pedagogie">Pédagogie</option>
              <option value="technique">Technique</option>
            </select>
          </div>

          <div id="container-option" class="hidden">
            <label class="block text-sm font-bold text-secondary-900 mb-2">Option *</label>
            <select id="select-option" class="w-full px-4 py-3 bg-white border border-secondary-300 rounded-xl text-sm focus:ring-2 focus:ring-secondary-500 outline-none">
              <option value="">-- Sélectionnez l'option --</option>
              <!-- Populated dynamically -->
            </select>
          </div>

        </div>
      </div>
    `
  };

  const optionsMap = {
    sciences: [
      {val: 'math-physique', text: 'Math-Physique'},
      {val: 'chimie-biologie', text: 'Chimie-Biologie'}
    ],
    litteraire: [
      {val: 'latin-philo', text: 'Latin-Philosophie'}
    ],
    pedagogie: [
      {val: 'pedagogie-generale', text: 'Pédagogie Générale'}
    ],
    technique: [
      {val: 'commerciale-gestion', text: 'Commerciale et Gestion'},
      {val: 'coupe-couture', text: 'Coupe et Couture'},
      {val: 'electricite', text: 'Électricité'},
      {val: 'mecanique', text: 'Mécanique Générale'}
    ]
  };

  // Helper inject CSS classes to generic inputs
  function setupInputs() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.classList.add('w-full', 'px-4', 'py-3', 'bg-gray-50', 'border', 'border-gray-200', 'rounded-xl', 'text-sm', 'focus:ring-2', 'focus:ring-primary-500', 'focus:bg-white', 'transition-all', 'outline-none');
    });

    // Enforce +243 on phone inputs
    const phoneInputs = document.querySelectorAll('.phone-input');
    phoneInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        if (!e.target.value.startsWith('+243')) {
          e.target.value = '+243' + e.target.value.replace(/\\D/g, '');
        }
      });
      // Allow only numbers and '+'
      input.addEventListener('keypress', (e) => {
        if (!/[0-9+]/.test(e.key)) e.preventDefault();
      });
    });

    // Handle Humanités nested selects
    const selectClasse = document.getElementById('select-classe-humanite');
    const selectSection = document.getElementById('select-section');
    const selectOption = document.getElementById('select-option');
    const containerSection = document.getElementById('container-section');
    const containerOption = document.getElementById('container-option');

    if (selectClasse) {
      selectClasse.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val.includes('hum')) {
          containerSection.classList.remove('hidden');
          selectSection.setAttribute('required', 'true');
        } else {
          containerSection.classList.add('hidden');
          containerOption.classList.add('hidden');
          selectSection.removeAttribute('required');
          selectOption.removeAttribute('required');
          selectSection.value = '';
          selectOption.value = '';
        }
      });
    }

    if (selectSection) {
      selectSection.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val && optionsMap[val]) {
          containerOption.classList.remove('hidden');
          selectOption.setAttribute('required', 'true');
          selectOption.innerHTML = '<option value="">-- Sélectionnez l\'option --</option>';
          optionsMap[val].forEach(opt => {
            selectOption.innerHTML += \`<option value="\${opt.val}">\${opt.text}</option>\`;
          });
        } else {
          containerOption.classList.add('hidden');
          selectOption.removeAttribute('required');
          selectOption.innerHTML = '<option value="">-- Sélectionnez l\'option --</option>';
        }
      });
    }
  }

  // Handle Institution Choice
  institutionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentInstitution = e.target.value;
      stepDemarche.classList.remove('hidden');
      form.classList.remove('hidden');
      
      // Inject form template
      dynamicFieldsContainer.innerHTML = templates[currentInstitution];
      setupInputs();
    });
  });

  // Handle Demarche Toggle
  demarcheRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentDemarche = e.target.value;
      if (currentDemarche === 'reinscription') {
        matriculeContainer.classList.remove('hidden');
        document.getElementById('matricule').setAttribute('required', 'true');
      } else {
        matriculeContainer.classList.add('hidden');
        document.getElementById('matricule').removeAttribute('required');
      }
    });
  });

  // Form Validation & Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formErrors.classList.add('hidden');

    // Basic custom validation check
    const invalidFields = form.querySelectorAll(':invalid');
    if (invalidFields.length > 0) {
      formErrorsText.textContent = "Veuillez vérifier les champs surlignés en rouge. Le format du numéro doit être +243 suivi de 9 chiffres.";
      formErrors.classList.remove('hidden');
      // Scroll to first error
      invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate API Call
    btnSubmit.disabled = true;
    btnSubmitText.textContent = "Envoi en cours...";
    btnSubmitSpinner.classList.remove('hidden');

    setTimeout(() => {
      btnSubmit.disabled = false;
      btnSubmitSpinner.classList.add('hidden');
      btnSubmitText.textContent = "Soumettre le dossier d'inscription";
      
      // Success state (Simple alert for now, could be a modal)
      alert('Félicitations ! Le dossier a été soumis avec succès.');
      form.reset();
      
      // Reset state
      stepDemarche.classList.add('hidden');
      form.classList.add('hidden');
      institutionRadios.forEach(r => r.checked = false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  });
});
