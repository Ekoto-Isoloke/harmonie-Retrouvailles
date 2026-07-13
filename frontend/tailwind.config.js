/** @type {import('tailwindcss').Config} */
// NOTE: In Tailwind CSS v4, configuration is done via CSS @theme in style.css.
// This file is kept for compatibility but all custom tokens are defined in style.css.
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./*.js"
  ],
}
