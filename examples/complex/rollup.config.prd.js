import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import NodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import path from "path";
import copy from "rollup-plugin-copy";
import PostCSS from "rollup-plugin-postcss";
import SanPlugin from "rollup-plugin-san";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import { babel } from '@rollup/plugin-babel';

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
      // commonjs(),
      SanPlugin({
        styleCompileOptions: {
          preprocessLang: 'less'
        }
      }),
      NodeResolve(),
      image(),
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
              useBuiltIns: "usage",
              corejs: 3
            }
          ]
        ],
        plugins: [
          [
            "@babel/plugin-proposal-class-properties"
          ]
        ]
      }),
      // uglify(),
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
    ],
    external: ["san", "axios"],
  },
];

export default config;
