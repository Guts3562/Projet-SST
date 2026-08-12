import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Forward cookies through the dev proxy so httpOnly refresh cookies work
        cookieDomainRewrite: 'localhost',
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              // Strip the Secure flag in dev so cookies work on http://localhost
              proxyRes.headers['set-cookie'] = setCookie.map((c) =>
                c.replace(/;\s*Secure/gi, '')
              );
            }
          });
        },
      },
    },
  },
})
