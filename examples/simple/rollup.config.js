import PluginSan from 'rollup-plugin-san';

export default [
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
    plugins: [PluginSan()],
    external: ['san'],
  },
];
