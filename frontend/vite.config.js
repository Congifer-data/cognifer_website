/* -----------------------------------------------------------------
File: frontend/vite.config.js
Purpose: Vite dev server + React plugin
----------------------------------------------------------------- */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
plugins: [react()],
server: {
port: 5173,
},
})