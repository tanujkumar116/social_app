import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server:{
    proxy:{
      "/api":{
          target:"http://localhost:5002",
          changeOrigin: true, // Ensures proper header forwarding
          secure: false, // Use only if backend runs with HTTP
      },
    }
  }
  
})
