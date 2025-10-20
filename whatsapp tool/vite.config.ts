import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@xenova/transformers'],
  },
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks: {
          'transformers': ['@xenova/transformers'],
          'webllm': ['@mlc-ai/web-llm'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
});
