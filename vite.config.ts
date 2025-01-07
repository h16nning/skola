import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Checker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  /*build: {
    outDir: "build",
  },*/
  css: {
    modules: {},
  },
  define: {
    ENABLE_FIREBASE: process.env.ENABLE_FIREBASE || true,
  },
  plugins: [react(), viteTsconfigPaths(), Checker({ typescript: true })],

  //changes for transition to tauri
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
