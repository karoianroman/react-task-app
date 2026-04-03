import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Робить шляхи відносними (вкрай важливо для Nginx)
  server: {
    host: true,
    port: 8080
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});