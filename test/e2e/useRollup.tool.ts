/** copy from rollup-plugin-vue/test/core.e2e.ts#95 2021.11.8 */

import path from 'path';
import { rollup, RollupOutput, RollupWarning } from 'rollup';

export default async function roll(name: string): Promise<RollupOutput> {
  const configFile = `../../examples/${name}/rollup.config.js`;
  const configModule = require(configFile);
  const configs = configModule.__esModule ? configModule.default : configModule;
  const config = Array.isArray(configs) ? configs[0] : configs;

  config.input = path.resolve(
    __dirname,
    path.dirname(configFile),
    config.input
  );
  delete config.output;

  config.onwarn = function (warning: RollupWarning, warn: Function) {
    switch (warning.code) {
      case 'UNUSED_EXTERNAL_IMPORT':
        return;
      default:
        warning.message = `(${name}) ${warning.message}`;
        warn(warning);
    }
  };

  const bundle = await rollup(config);

  return bundle.generate({ format: 'esm' });
}
