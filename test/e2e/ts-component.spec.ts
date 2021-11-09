import { RollupOutput } from 'rollup';
import roll from './useRollup.tool';

describe('typescript component', () => {
  let result!: RollupOutput;

  beforeAll(async () => {
    result = await roll('ts-component');
  });

  it('should compile <script lang="ts">', () => {
    expect(result.output[0].code).toEqual(
      // 有逗号
      expect.stringContaining('date: new Date().toLocaleDateString(),')
    );
  });
});
