import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

let commitHash = process.env.VITE_COMMIT_HASH || '';
if (!commitHash) {
  try {
    commitHash = execSync('git rev-parse --short=4 HEAD').toString().trim();
  } catch (e) {
    commitHash = 'LIVE'; // Fallback if no git info available
  }
}
// Ensure it's the last 4 characters if it's too long
if (commitHash.length > 4) commitHash = commitHash.slice(-4);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    '__COMMIT_HASH__': JSON.stringify(commitHash),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
