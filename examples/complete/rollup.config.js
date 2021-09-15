import config from './config/index';

import SanPlugin from "../../src/index";
import PostCSS from "rollup-plugin-postcss";
import NodeResolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "app.san",
    output: {
      file: "dist/index.js",
      format: "iife",
      sourcemap: "inline",
    },
    plugins: [
      // 找模块必备
      NodeResolve(),
      // 透传参数到内置 postcss
      SanPlugin({
        cssModulesOptions: {
          generateScopedName: "[local]___[hash:base64:5]",
        },
      }),
      // 处理 css 必须有
      PostCSS(),
    ]
  },
];
