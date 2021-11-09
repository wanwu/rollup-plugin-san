import path from 'path';

// import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import NodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import copy from 'rollup-plugin-copy';
import PostCSS from 'rollup-plugin-postcss';
import SanPlugin from 'rollup-plugin-san';
import typescript from 'rollup-plugin-typescript2';
import browsersync from 'rollup-plugin-browsersync';

const dev = process.env.ENV === 'dev';

const config = [
  {
    input: 'src/main.js',
    output: [
      !dev && {
        file: 'dist/app.esm.js',
        format: 'esm',
        sourcemap: 'none',
      },
      {
        file: 'dist/app.global.js',
        format: 'iife',
        sourcemap: 'none',
        globals: {
          san: 'san',
          axios: 'axios',
        },
        name: 'sanApp',
      },
    ],
    plugins: [
      SanPlugin({
        templateCompileOptions: {
          compileANode: 'aPack',
        },
        styleCompileOptions: {
          preprocessLang: 'less',
        },
      }),
      NodeResolve(),
      image(),
      commonjs(),
      PostCSS(),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      copy({
        targets: [
          { src: './index.html', dest: 'dist/' },
          {
            src: './src/*.svg',
            dest: 'dist/',
          },
        ],
      }),
      dev &&
        browsersync({
          watch: true,
          server: 'dist',
          files: 'dist',
          logLevel: 'silent',
        }),
    ],
    external: ['san', 'axios'],
  },
];

export default config;
