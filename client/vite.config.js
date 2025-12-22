import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React-DOM into their own chunk
          "react-vendor": ["react", "react-dom", "react-router"],

          // Chakra UI in its own chunk (it's large)
          "chakra-vendor": ["@chakra-ui/react", "@emotion/react"],

          // Icons library separate
          "icons-vendor": ["lucide-react", "react-icons"],

          // Redux in its own chunk
          "redux-vendor": ["redux", "react-redux"],

          // Utilities
          "utils-vendor": ["axios"],
        },
      },
    },
    // Optimize chunk size
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "@chakra-ui/react"],
  },
});
