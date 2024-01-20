import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/${assetInfo.name}`;
          }
          return `assets/${assetInfo.name}`; // Оставляем остальные файлы в папке assets
        },
      },
    },
  },
});
