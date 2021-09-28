import path from "path";
import NodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';

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
      commonjs(),
      SanPlugin({
        esModule: true,
      }),
      image(),
      PostCSS(),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      uglify(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      copy({
        targets: [{ src: "./index.html", dest: "dist/" }],
      }),
    ],
    external: ["san"],
  },
];

export default config;
