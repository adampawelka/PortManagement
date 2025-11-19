// Frontend/vitest.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    
    // --- NUEVA CONFIGURACIÓN PARA EL REPORTE ---
    reporters: ['default', 'junit'], // Use 'default' (console) and 'junit' reporter
    outputFile: 'junit.xml',         // Name of the output file
    // ------------------------------------------
  },
});