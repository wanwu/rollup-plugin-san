import { RollupOutput } from 'rollup';
import roll from './useRollup.tool';

describe('complex', () => {
  let result!: RollupOutput;

  beforeAll(async () => {
    result = await roll('complex');
  });

  it('👀 complex example should work', () => {
    expect(result.output[0].code).toEqual(expect.stringContaining('San.js'));
    expect(result.output[0].code).toEqual(
      expect.stringContaining('san child with css modules')
    );
    expect(result.output[0].code).toEqual(
      expect.stringContaining('background: blue;overflow:hidden')
    );
  });
});
