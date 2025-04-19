// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace this with your GitHub repo name
const repoName = 'Memora'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // Needed for GitHub Pages
})
