const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace bg-white (not preceded by hover: or focus:)
    content = content.replace(/(?<![:-])\bbg-white\b/g, "bg-primary-900/40 backdrop-blur-xl border border-white/10 shadow-glass text-white");
    
    // Replace some text colors that were for white backgrounds
    content = content.replace(/\btext-dark-paper\b/g, "text-white");
    content = content.replace(/\btext-gray-800\b/g, "text-gray-200");
    content = content.replace(/\btext-gray-700\b/g, "text-gray-300");
    content = content.replace(/\bbg-gray-50\b/g, "bg-primary-800/40");
    
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
}

const dir = path.join(__dirname, 'frontend');
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(dir, file));
    }
});
