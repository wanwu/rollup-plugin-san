// import PluginSan from 'rollup-plugin-san'
import PluginSan from '../../'

export default [
  {
    input: 'src/App.san',
    output: {
      file: 'dist/app.js',
      format: 'esm',
      sourcemap: 'inline'
    },
    plugins: [PluginSan()],
    external: ['san'],
  },
]
