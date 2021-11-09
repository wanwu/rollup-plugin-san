import path from "path";
import { fileURLToPath } from "url";

import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from "@rollup/plugin-image";
import NodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import typescript from "rollup-plugin-typescript2";
import browsersync from "rollup-plugin-browsersync";

const filename = fileURLToPath(import.meta.url);
const getPath = (file) => path.resolve(path.dirname(filename), file);

const config = [
  {
    input: "src/main.js",
    output: {
      file: "dist/app.js",
      format: "iife",
      sourcemap: "none",
      name: "sanApp"
    },
    plugins: [
      SanPlugin({
        templateCompileOptions: {
          compileANode: 'aPack'
        },
        styleCompileOptions: {
          preprocessLang: 'less'
        }
      }),
      NodeResolve(),
      image(),
      commonjs(),
      PostCSS(),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: [
                  "last 2 versions",
                  "safari >= 7",
                  "ie >= 11",
                  "edge >= 15",
                  "firefox >= 45",
                  "chrome >= 49",
                  "opera >= 43",
                  "android >= 4.4",
                  "ios >= 9"
                ]
              },
              useBuiltIns: "usage"
            }
          ]
        ],
        plugins: [
          [
            "@babel/plugin-proposal-class-properties"
          ]
        ]
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      copy({
        targets: [
          { src: "./index.html", dest: "dist/" },
          {
            src: "./src/*.svg",
            dest: "dist/",
          },
        ],
      }),
      browsersync({
        watch: true,
        server: getPath("./dist"),
        files: getPath("./dist"),
        logLevel: "silent",
      })
    ],
    external: ["san", "axios"],
  },
];

export default config;
