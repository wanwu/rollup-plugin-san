/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file style.js
 * @description 根据 san 文件代码块生成对应 style 部分的 import 代码
 */
import createDebugger from "debug";

import { getContent } from "../utils/content";
import { formatQuery } from "../utils/query";
import { cssModules, preProcessLess } from "../transformers/transformStyle";

const debug = createDebugger("rollup-plugin-san:blocks/style.js");

/**
 * 根据 san 文件代码块生成对应 style 部分的 import 代码
 * @param {*} descriptor
 * @param {*} scopeId
 * @param {*} options
 * @returns
 */
export function generateStyleImport(descriptor, scopeId, options) {
  debug("generateStyleImport", descriptor, scopeId, options);

  let stylesImport = "var injectStyles = [];\n";
  const injectStyles = [];

  const styles = descriptor.style;

  if (styles && styles.length) {
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      const isCSSModule = style.attribs.module !== undefined;

      const src = style.attribs.src || descriptor.filename;
      const idQuery = `&id=${scopeId}`;
      const srcQuery = style.attribs.src ? `&src` : ``;
      const attrsQuery = formatQuery(style.attribs, "css");

      const query = `?san&type=style&index=${i}${srcQuery}${idQuery}`;
      const resource = src + query + attrsQuery;

      if (isCSSModule) {
        stylesImport += options.esModule
          ? `import ${JSON.stringify(resource)};\n
            import style${i} from ${JSON.stringify(resource + ".js")};`
          : `require('${resource}');\n
            var style${i} = require('resource + ".js"')`;

        injectStyles.push(`style${i}`);
      } else {
        stylesImport += options.esModule
          ? `import ${JSON.stringify(resource)};`
          : `require('${resource}');`;
      }
    }
  }

  return stylesImport + `injectStyles.push(${injectStyles});`;
}

export async function getStyleCode(descriptor, query, options) {
  const code = `${options.esModule ? "export default " : "module.exports = "}`;

  const style = descriptor.style[query.index];

  const styleContent = await preProcessLess(style.content);

  const { css, cssHash } = await cssModules(styleContent, options);

  const { map } = getContent(descriptor.source, style, {
    resourcePath: descriptor.filename,
    ast: descriptor.ast,
  });

  return {
    code:
      query.module !== undefined
        ? query["lang.css.js"] !== undefined ||
          query["lang.less.js"] !== undefined
          ? code + JSON.stringify(cssHash)
          : css
        : style.content,
    map,
  };
}
