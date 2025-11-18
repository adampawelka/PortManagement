import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true, 
    environment: 'jsdom', // This line simulates the fake browser
    setupFiles: ['./src/setupTests.js'], // Configure extra functions of jets-dom
  },
});