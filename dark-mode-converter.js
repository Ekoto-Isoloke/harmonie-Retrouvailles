const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert light theme background classes to dark premium glass
    content = content.replace(/(?<![:-])\bbg-white\b/g, "bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white");
    content = content.replace(/(?<![:-])\bbg-gray-50\b/g, "bg-[#112240]/60 border border-white/5");
    
    // Fix text colors for legibility on dark backgrounds
    content = content.replace(/(?<![:-])\btext-primary-900\b/g, "text-white");
    content = content.replace(/(?<![:-])\btext-dark-paper\b/g, "text-white");
    content = content.replace(/(?<![:-])\btext-gray-800\b/g, "text-gray-100");
    content = content.replace(/(?<![:-])\btext-gray-700\b/g, "text-gray-200");
    content = content.replace(/(?<![:-])\btext-gray-600\b/g, "text-gray-300");
    content = content.replace(/(?<![:-])\btext-gray-500\b/g, "text-gray-400");
    
    // Borders
    content = content.replace(/(?<![:-])\bborder-gray-200\b/g, "border-white/10");
    content = content.replace(/(?<![:-])\bborder-gray-100\b/g, "border-white/5");
    
    fs.writeFileSync(filePath, content);
    console.log("Converted", filePath);
}

const dir = path.join(__dirname, 'frontend');
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(dir, file));
    }
});
