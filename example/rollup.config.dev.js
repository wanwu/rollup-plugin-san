import path from "path";
import { fileURLToPath } from "url";

import NodeResolve from "@rollup/plugin-node-resolve";
import browsersync from "rollup-plugin-browsersync";
import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import image from '@rollup/plugin-image';

const filename = fileURLToPath(import.meta.url);
const getPath = (file) => path.resolve(path.dirname(filename), file);

const config = [
  {
    input: "src/main.js",
    output: {
      file: "dist/index.js",
      format: "iife",
      sourcemap: "none",
      // globals: {
      //   san: "san",
      // },
    },
    plugins: [
      NodeResolve(),
      commonjs(),
      SanPlugin({
        esModule: true,
      }),
      image(),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      PostCSS(),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      copy({
        targets: [
          { src: "./index.html", dest: "dist/" },
          {
            src: "./src/*.svg",
            dest: "dist/",
          },
          // {
          //   src: "./src/*.png",
          //   dest: "dist/",
          // },
          // {
          //   src: "./src/*.jpg",
          //   dest: "dist/",
          // },
        ],
      }),
      browsersync({
        watch: true,
        server: getPath("./dist"),
        files: getPath("./dist"),
        logLevel: "silent",
      }),
    ],
    // external: ["san"],
  },
];

export default config;
