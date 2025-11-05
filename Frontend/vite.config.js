import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow short imports like `visualisation/Port_Visualisation/...`
      visualisation: path.resolve(__dirname, '../Visualisation')
    }
  },
  server: {
    fs: {
      // Allow serving files from project root's parent (the Visualisation folder)
      allow: [path.resolve(__dirname, '..')]
    }
  }
})
