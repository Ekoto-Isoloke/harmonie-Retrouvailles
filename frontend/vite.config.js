import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin-dashboard.html'),
        login: resolve(__dirname, 'login.html'),
        compta: resolve(__dirname, 'compta-dashboard.html'),
        parent_dash: resolve(__dirname, 'parent-dashboard.html'),
        parent_act: resolve(__dirname, 'parent-activation.html'),
        prefet: resolve(__dirname, 'prefet-dashboard.html'),
        rh: resolve(__dirname, 'rh-dashboard.html'),
        teacher: resolve(__dirname, 'teacher-dashboard.html')
      }
    }
  }
})
