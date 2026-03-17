import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// ... existing imports
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ... server config
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000, // Increased
    target: 'esnext',           // Change from es2015 to esnext for better performance
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'animations';
            if (id.includes('lucide')) return 'ui';
            return 'vendor'; // Groups other dependencies
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Keep treeshake but let it be more flexible
      treeshake: 'recommended', 
    },
  },
})