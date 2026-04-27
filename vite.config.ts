import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

const REPO_BASE = '/Lauftrainer/';

export default defineConfig({
  base: REPO_BASE,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: "Mats' Lauftrainer",
        short_name: 'Lauftrainer',
        description: 'Personalisierter Trainings-Coach',
        theme_color: '#2B4A3F',
        background_color: '#F7F4ED',
        display: 'standalone',
        orientation: 'portrait',
        scope: REPO_BASE,
        start_url: REPO_BASE,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
});
