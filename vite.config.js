import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Додаємо відносні шляхи, щоб index.html правильно знаходив JS/CSS у папці /assets
  base: './', 
  build: {
    // Явно вказуємо папку збірки (має збігатися з тим, що в Dockerfile)
    outDir: 'dist',
  }
});