import NodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import { uglify } from "rollup-plugin-uglify";

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
      PostCSS(),
      // uglify(),
      copy({
        targets: [{ src: "./index.html", dest: "dist/" }],
      }),
    ],
    external: ["san"],
  },
];

export default config;
