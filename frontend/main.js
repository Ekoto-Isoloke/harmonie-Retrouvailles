// Import Tailwind v4 CSS (processed via Vite)
import './src/style.css'
// Import Authentication Modal Logic (must be at top level in ES Modules)
import './src/direction-auth.js'

// Effet de scroll sur la navbar pour le glassmorphism
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/95');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
    }
  });
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

