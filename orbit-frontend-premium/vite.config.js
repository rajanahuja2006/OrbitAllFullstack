
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ babel: { configFile: false, babelrc: false } })],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5001/api')
  },
  server: {
    port: 5177,
    strictPort: false,  // Auto-increment if taken
  }
});
