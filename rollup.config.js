import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  plugins: [
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    uglify(),
  ],
  output: [
    {
      exports: "default",
      file: "dist/index.es.js",
      format: "es",
    },
    {
      exports: "default",
      file: "dist/index.cjs.js",
      format: "cjs",
    },
  ],
  external: [
    "fs",
    "debug",
    "qs",
    "path",
    "querystring",
    "@babel/runtime/helpers/readOnlyError",
    "@babel/runtime/helpers/asyncToGenerator",
    "@babel/runtime/helpers/defineProperty",
    "@babel/runtime/regenerator",
    "@babel/runtime/helpers/slicedToArray",
  ].concat(Object.keys(pkg.dependencies)),
};
