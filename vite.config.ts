import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'import.meta.env.CASHFREE_CLIENT_ID': JSON.stringify(process.env.CASHFREE_CLIENT_ID),
    'import.meta.env.CASHFREE_CLIENT_SECRET': JSON.stringify(process.env.CASHFREE_CLIENT_SECRET),
    'import.meta.env.CASHFREE_ENV': JSON.stringify(process.env.CASHFREE_ENV),
  },
  server: {
    port: 8081,
    host: true, // Listen on all addresses, including network
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
