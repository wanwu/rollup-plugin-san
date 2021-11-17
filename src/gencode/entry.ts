import path from 'path';

import hash from 'hash-sum';
import { parseSFC } from 'san-sfc-compiler';

import { Options } from '../';
import genTemplate from './template';
import genScript from './script';
import genStyle from './style';
import { setDescriptor } from '../utils';

export default (
  source: string,
  filename: string,
  options: Options,
  sourceRoot: string
) => {
  const descriptor = parseSFC({
    source,
    filename,
    sourceRoot,
    needMap: true,
  });
  setDescriptor(filename, descriptor);

  const shortFilePath = path
    .relative(sourceRoot, filename)
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/\\/g, '/');

  const scopeId = hash(shortFilePath);

  const templateImport = genTemplate(descriptor, scopeId);
  const scriptImport = genScript(descriptor, scopeId);
  const stylesImport = genStyle(descriptor, scopeId, !!options.styleCompileOptions?.preprocessLang);

  let templateType = 'template';
  const anode = options.templateCompileOptions?.compileANode;
  if (anode && anode !== 'none') {
    templateType = anode;
  }

  const hasCSSModules = descriptor.styles.some((s) => s.module);
  const injectStyleToData = hasCSSModules
    ? `var origin = typeof script === 'function'
    ? (script.prototype.initData || __noData)
    : (script.initData || __noData);
    function __noData() {
      return {$style: $style};
    }
    function __finalInitData() {
        return Object.assign({}, origin.call(this), {$style: $style});
    }
    if (typeof script === 'function') {
      script.prototype.initData = __finalInitData;
    } else {
      script.initData = __finalInitData;
    }`
    : '';

  const output = [
    scriptImport,
    templateImport,
    stylesImport,
    `script.${templateType} = template`,
    injectStyleToData,
    'export default script',
  ];

  return {
    code: output.join('\n'),
    map: {
      version: 3,
      mappings: '',
      sources: [],
      names: [],
    },
  };
};
