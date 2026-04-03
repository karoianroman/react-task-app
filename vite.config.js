import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Цей рядок КРИТИЧНИЙ для Docker. Він каже Vite використовувати 
  // відносні шляхи для підключення JS та CSS.
  base: './', 
  build: {
    outDir: 'dist',
  },
  server: {
    // Налаштування для локальної розробки
    host: true,
    port: 5173,
  }
});