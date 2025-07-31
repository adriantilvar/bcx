/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { configDefaults } from "vitest/config"
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bcx',
      fileName: 'bcx',
    }
  },
  test: {
    coverage: {
      reporter: ["text"],
      exclude: [...configDefaults.coverage.exclude ?? "", "./src/index.ts"]
    }
  },
})