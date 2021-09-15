import babel from "rollup-plugin-babel";
var pkg = require("./package.json");
var external = Object.keys(pkg.dependencies);

export default {
  input: "src/index.js",
  plugins: [
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
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
    "@babel/runtime/helpers/asyncToGenerator",
    "@babel/runtime/helpers/defineProperty",
    "@babel/runtime/regenerator",
    "@babel/runtime/helpers/slicedToArray",
  ],
};
