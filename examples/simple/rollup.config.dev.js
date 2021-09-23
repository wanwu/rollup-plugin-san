import path, { resolve as resolvePath, dirname } from "path";
import { fileURLToPath } from "url";

import NodeResolve from "@rollup/plugin-node-resolve";
import browsersync from "rollup-plugin-browsersync";
import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import typescript from 'rollup-plugin-typescript2'

const filename = fileURLToPath(import.meta.url);
const getPath = (file) => resolvePath(dirname(filename), file);

const config = [
  {
    input: "src/main.js",
    output: {
      file: "dist/index.js",
      format: "iife",
      sourcemap: "none",
      globals: {
        san: "san",
      },
    },
    plugins: [
      NodeResolve(),
      SanPlugin({
        esModule: true,
      }),
      typescript({
        // Absolute path to import correct config in e2e tests
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      PostCSS(),
      copy({
        targets: [{ src: "./index.html", dest: "dist/" }],
      }),
      browsersync({
        watch: true,
        server: getPath("./dist"),
        files: getPath("./dist"),
        logLevel: "silent",
      }),
    ],
    external: ["san"],
  },
];

export default config;
