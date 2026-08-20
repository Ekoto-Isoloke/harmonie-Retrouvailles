const fs = require('fs');
let f = fs.readFileSync('frontend/teacher-dashboard.html', 'utf8');
f = f.replace(/\\\\'/g, "\\'");
fs.writeFileSync('frontend/teacher-dashboard.html', f);
console.log('Fixed quotes!');
