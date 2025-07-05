import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 👈 This makes sure Vercel can find assets and routes properly
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
