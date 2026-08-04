const fs = require('fs');
let content = fs.readFileSync('login.html', 'utf8');

content = content.replace('Portail ERP Direction & RH', 'Portail Super-Administration');
content = content.replace(/Système de Gestion<br>Éducative EPST/g, 'Connexion à<br>L\\'Administration');
content = content.replace('Espace sécurisé réservé à la Direction, Préfets, Directeurs d\\'Études et Enseignants certifiés de Kinshasa.', 'Accès sécurisé exclusif à la Direction Générale et au Super-Administrateur.');
content = content.replace(/Connexion à l'Espace Direction/g, 'Connexion Super-Admin');
content = content.replace('Accédez à votre tableau de bord sécurisé EPST.', 'Accès réservé à la Direction Générale et au Super-Administrateur.');
content = content.replace(/Se Connecter à l'Espace Direction/g, 'Se Connecter à l\\'Administration');

const initDBRegex = /function initDB\(\) \{[\s\S]*?localStorage\.setItem\('hr_users_db_v2', JSON\.stringify\(db\)\);\n\}/;
const adminInitDB = `function initDB() {
  let db = JSON.parse(localStorage.getItem('hr_users_db_v2')) || [];
  
  // Auto-Recovery : S'assurer que le compte Super-Admin existe
  const adminExists = db.find(u => u.role === 'Super-Admin');
  if (!adminExists) {
    db.push({
      id: 1, 
      email: 'harmonie@retrouvailes@2026', 
      password: 'retrouvaille@2026', 
      role: 'Super-Admin', 
      nom: 'Direction', 
      prenom: 'Générale', 
      phone: '', 
      ecole: 'Harmonie-Retrouvailles', 
      courses: '' 
    });
  }

  localStorage.setItem('hr_users_db_v2', JSON.stringify(db));
}`;

content = content.replace(initDBRegex, adminInitDB);

content = content.replace(/currentPortal = 'direction';/g, "currentPortal = 'admin';");

fs.writeFileSync('admin-login.html', content);
