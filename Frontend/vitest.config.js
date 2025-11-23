// npm test
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    
    // Configuration needed to save the report
    reporters: ['default', 'junit'], 
    outputFile: 'junit.xml',         // Name of the output file
  },
});