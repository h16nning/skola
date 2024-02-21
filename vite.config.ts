import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import Checker from "vite-plugin-checker";

export default defineConfig({
  build: {
    outDir: "build",
  },
  css: {
    modules: {},
  },
  define: {
    ENABLE_FIREBASE: process.env.ENABLE_FIREBASE || true,
  },
  plugins: [react(), viteTsconfigPaths(), Checker({ typescript: true })],
});
