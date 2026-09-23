import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@types": path.resolve(import.meta.dirname, "./shared/types"),
      "@data": path.resolve(import.meta.dirname, "./shared/data"),
    },
  },
});
