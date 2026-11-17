import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// /api is proxied to the existing Express backend (backend/server.js, port 4000)
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:4000', '/ws': { target: 'ws://localhost:4000', ws: true } } } });
