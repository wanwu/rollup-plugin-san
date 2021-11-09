import { RollupOutput } from 'rollup';
import roll from './useRollup.tool';

describe('css-modules', () => {
  let result!: RollupOutput;

  beforeAll(async () => {
    result = await roll('css-modules');
  });

  it('should have cssHashMap object', () => {
    expect(result.output[0].code).toEqual(
      expect.stringContaining('$style.red')
    );
    // {"red":"xxx"};
    expect(result.output[0].code).toEqual(expect.stringContaining('{"red":'));
  });
});
