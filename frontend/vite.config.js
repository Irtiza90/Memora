// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'Memora'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // Needed for GitHub Pages
})
