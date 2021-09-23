import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

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
    "rollup-pluginutils",
    "san",
    "hash-sum",
    "postcss",
    "dom-serializer",
    "san-anode-utils",
    "postcss-selector-parser",
    "postcss-modules",
    "@babel/runtime/helpers/asyncToGenerator",
    "@babel/runtime/helpers/defineProperty",
    "@babel/runtime/regenerator",
    "@babel/runtime/helpers/slicedToArray",
  ],
};
