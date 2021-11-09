import PluginSan from 'rollup-plugin-san';
import PostCSS from 'rollup-plugin-postcss';
import NodeResolve from '@rollup/plugin-node-resolve';

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: 'src/App.san',
    output: [
      {
        file: 'dist/app.esm.js',
        format: 'esm',
        sourcemap: 'none',
      },
      {
        file: 'dist/app.global.js',
        format: 'iife',
        sourcemap: 'inline',
        name: 'sanApp',
      },
    ],
    plugins: [PluginSan(), NodeResolve(), PostCSS()],
    external(id) {
      return /^(san)$/.test(id);
    },
  },
];

export default config;
