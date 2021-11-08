import path from 'path'

import PluginSan from 'rollup-plugin-san'
import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'sanApp',
      file: 'dist/app.js',
      format: 'iife',
      sourcemap: 'inline',
    },
    plugins: [
      PluginSan(),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
    external: ['san'],
  },
]
