/// <reference types="vitest" />
import {defineConfig} from "vite";
// @ts-ignore
import packageJson from "./package.json";
import * as path from "path";
import dts from 'vite-plugin-dts'

const getPackageNameCamelCase = () => {
  try {
    return packageJson.name.replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: ['src/index.ts', 'src/auto.ts'],
      name: getPackageNameCamelCase(),
      fileName: (format, entryName) => {
        return (format === "es" ? `${entryName}.js` : `${entryName}.umd.js`)
      },
    },
    rollupOptions: {
      input: {
        'index': path.resolve(__dirname, 'src/index.ts'),
        'auto': path.resolve(__dirname, 'src/auto.ts'),
      }
    },
  },
  test: {},
  plugins: [
    dts({
      outputDir: ['dist'],
    })
  ]
});
