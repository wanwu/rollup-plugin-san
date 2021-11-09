import hash from 'hash-sum';
import PluginSan from '../../dist';
import transformTemplate from '../../dist/transform/template';

describe('transform anode or apack', () => {
  let transform;
  beforeEach(() => {
    transform = PluginSan().transform!;
  });

  const filename = 'example.san';
  const id = hash(filename);
  const request = `import template from "${filename}?san&type=template&id=${id}&compileANode=aPack&lang.js"`;

  it('template request should has aPack string', async () => {
    const { code } = await transform(
      `<template compileANode="aPack">
          <div>anode</div>
        </template>
        <script>export default {}</script>`,
      `example.san`
    );

    expect(code).toEqual(expect.stringContaining(request));
    expect(code).toEqual(expect.stringContaining(`export default script`));
  });

  it('should transform <template compileANode="aPack">', async () => {
    const { code } = transformTemplate(
      '<div>anode</div>',
      request,
      {
        include: /\.san$/,
        exclude: [],
      },
      {
        id,
        filename,
        compileANode: 'aPack',
      },
      false
    );

    expect(code).toEqual(
      expect.stringContaining('[1,"div",1,null,3,"anode"];')
    );
  });
});
