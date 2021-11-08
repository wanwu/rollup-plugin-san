import { compileStyle } from 'san-sfc-compiler';
import { Options } from '..';
import { Query, normalizeSourceMap } from '../utils';

export default (
  code: string,
  request: string,
  options: Options,
  query: Query
) => {
  const result = compileStyle({
    source: code,
    filename: query.filename!,
    id: `data-s-${query.id}`,
    scoped: !!query.scoped,
    modules: !!query.module as any,
    ...options.styleCompileOptions,
  });

  const ifCSSHashMap = ['css', 'less', 'sass', 'scss', 'styl']
    .map((ext) => `lang.${ext}.js`)
    .some((lang) => lang in query);

  if (ifCSSHashMap) {
    return {
      code: `export default ${JSON.stringify(result.cssHashMap)}`,
      map: null,
    };
  } else {
    return {
      code: result.code,
      map: normalizeSourceMap(result.map!, request),
    };
  }
};
