import { RollupOutput } from 'rollup';
import roll from './useRollup.tool';

describe('simple', () => {
  let result!: RollupOutput;

  beforeAll(async () => {
    result = await roll('simple');
  });

  it('🌟 should compile <template>', () => {
    expect(result.output[0].code).toEqual(
      expect.stringContaining('var script = ')
    );

    expect(result.output[0].code).toEqual(
      expect.stringContaining(`name: 'San.js',`)
    );
  });
});
