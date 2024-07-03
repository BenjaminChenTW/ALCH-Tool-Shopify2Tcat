import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodePolyfills(),
  ],
});
