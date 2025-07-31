/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "better-variants",
      fileName: "index",
      formats: ["es"],
    },
  },
  test: {
    coverage: {
      reporter: ["text"],
      exclude: [...(configDefaults.coverage.exclude ?? ""), "./src/index.ts"],
    },
  },
});
