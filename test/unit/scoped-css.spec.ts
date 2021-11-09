import hash from 'hash-sum';
import transformTemplate from '../../dist/transform/template';
import transformStyle from '../../dist/transform/style';

describe('transform less', () => {
  const filename = 'example.san';
  const id = hash(filename);
  const templateRequest = `import template from "${filename}?san&type=template&id=${id}&lang.js"`;
  const styleRequest = `import "${filename}?san&type=style&index=${0}&id=${id}&lang.less"`;

  it('template code should has scoped attribute', async () => {
    const templateCode = '<div class="red">scoped css</div>';

    const { code } = transformTemplate(
      templateCode,
      templateRequest,
      {
        include: /\.san$/,
        exclude: [],
      },
      {
        id,
        filename,
      },
      true
    );

    expect(code).toEqual(expect.stringContaining(id));
  });

  it('style code should has scoped attribute', async () => {
    const styleCode = '.red { color: red; }';

    const { code } = transformStyle(
      styleCode,
      styleRequest,
      {
        include: /\.san$/,
        exclude: [],
      },
      {
        id,
        filename,
        lang: 'less',
        scoped: true,
      }
    );

    expect(code).toEqual(expect.stringContaining(id));
  });
});
