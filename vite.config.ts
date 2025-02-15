import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Checker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  css: {
    modules: {},
  },
  define: {
    ENABLE_FIREBASE: process.env.ENABLE_FIREBASE || true,
    PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL || "/"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), viteTsconfigPaths(), Checker({ typescript: true })],
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
    outDir: "dist",
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
