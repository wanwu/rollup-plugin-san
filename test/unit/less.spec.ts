import hash from 'hash-sum';
import PluginSan from '../../dist';
import transformStyle from '../../dist/transform/style';

describe('transform less', () => {
  let transform;
  beforeEach(() => {
    transform = PluginSan().transform!;
  });

  const filename = 'example.san';
  const id = hash(filename);
  const request = `import "${filename}?san&type=style&index=${0}&id=${id}&lang.less"`;

  it('style lang=less request should be import as less string', async () => {
    const { code } = await transform(
      `<style lang="less">.red { font-size: 1 + 12 px; }</style>
      <template><div class="red">ok</div></template>
      <script>export default {}</script>`,
      `example.san`
    );

    expect(code).toEqual(expect.stringContaining(request));
    expect(code).toEqual(expect.stringContaining(`export default script`));
  });

  it('should transform <style lang="less"> block', async () => {
    const { code } = transformStyle(
      '.red { font-size: 1+12 px; }',
      request,
      {
        include: /\.san$/,
        exclude: [],
      },
      {
        id,
        filename,
        lang: 'less',
      }
    );
    expect(code).toEqual(expect.stringContaining('font-size: 13 px;'));
  });
});
