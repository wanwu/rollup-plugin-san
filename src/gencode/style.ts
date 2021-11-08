import { SFCDescriptor } from 'san-sfc-compiler';

import { attrsToQuery } from '../utils';

function genCSSModulesCode(index: number, request: string): string {
  const styleVar = `style${index}`;
  let code =
    `\nimport ${JSON.stringify(request)}` +
    // 运行时
    `\nimport ${styleVar} from ${JSON.stringify(request + '.js')}`;
  code += `\n$style = Object.assign($style, ${styleVar})`;
  return code;
}

export default (
  descriptor: SFCDescriptor,
  scopeId: string,
  preprocessStyles?: boolean
) => {
  let stylesCode = ``;
  // 全局开关
  let hasCSSModules = false;
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style, i) => {
      const src = style.src || descriptor.filename;
      const attrsQuery = attrsToQuery(style.attrs, 'css', preprocessStyles);
      const idQuery = `&id=${scopeId}`;
      const srcQuery = style.src ? `&src` : ``;
      const query = `?san&type=style&index=${i}${srcQuery}${idQuery}`;
      const styleRequest = src + query + attrsQuery;
      if (style.module) {
        if (!hasCSSModules) {
          stylesCode += `\nvar $style = {};`;
          // 防止重复赋值
          hasCSSModules = true;
        }
        stylesCode += genCSSModulesCode(i, styleRequest);
      } else {
        stylesCode += `\nimport ${JSON.stringify(styleRequest)}`;
      }
    });
  }
  return stylesCode;
};
