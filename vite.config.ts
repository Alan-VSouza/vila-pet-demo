import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // as verificações do kit criam perfis do Chrome em .taste-skill; o Vite não deve vigiar essa pasta
  server: { watch: { ignored: ['**/.taste-skill/**'] } },
})
