import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePWA({
          registerType: 'autoUpdate',
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.js',
          injectManifest: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          },
          devOptions: {
              enabled: true,
              type: 'module'
          },
          manifest: {
              name: 'Lead Control System',
              short_name: 'Leads',
              start_url: '/',
              display: 'standalone',
              orientation: 'portrait-primary',
              background_color: '#ffffff',
              theme_color: '#000000',
              icons: [
                  {
                      src: '/icon-192.png',
                      sizes: '192x192',
                      type: 'image/png'
                  },
                  {
                      src: '/icon-512.png',
                      sizes: '512x512',
                      type: 'image/png'
                  },
                  {
                      src: '/icon-512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: 'maskable'
                  }
              ]
          }
      })
  ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        https: {
            key: fs.readFileSync('./certs/localhost+3-key.pem'),
            cert: fs.readFileSync('./certs/localhost+3.pem'),
        },
        proxy: {
            '/api': {
                target: 'https://localhost:443',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        },
        watch: {
            usePolling: true
        }
    }
})
