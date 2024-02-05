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
  plugins: [react(), viteTsconfigPaths(), Checker({ typescript: true })],
});
