const fs = require('fs');
const path = require('path');

function searchInFiles(dir, searchRegex) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'repo.zip' || file === 'replace.js') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            searchInFiles(fullPath, searchRegex);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                if (searchRegex.test(line)) {
                    console.log(`Found in ${fullPath}:${i+1}: ${line.trim()}`);
                }
            });
        }
    }
}

searchInFiles(path.join(__dirname, 'frontend'), /bg-white/);
