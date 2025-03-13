
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Add vendor chunk splitting for better caching
    splitVendorChunkPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable chunk size reporting on build
    reportCompressedSize: true,
    // Optimize chunk size with this setting
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking for large dependencies
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'charts': ['recharts'],
          'date-utils': ['date-fns'],
          'form-handling': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
    // Minify the output for production
    minify: true,
    // Generate source maps for easier debugging
    sourcemap: mode !== 'production',
  },
  // Enable dependency optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dropdown-menu',
      'recharts',
      'i18next'
    ],
  },
}));
