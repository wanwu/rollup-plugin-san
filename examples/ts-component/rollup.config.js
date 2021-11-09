import path from 'path';

import PluginSan from 'rollup-plugin-san';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
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
    plugins: [
      PluginSan(),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
    external: ['san'],
  },
];
