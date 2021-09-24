/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file style.js
 * @description
 */
import createDebugger from "debug";

import { formatQuery } from "../utils/query";

const debug = createDebugger("rollup-plugin-san:blocks/style.js");

/**
 * 根据 san 文件代码块生成对应 style 部分的 import 代码
 *
 * @param {Object} descriptor san 文件代码块描述对象
 * @param {Object} options 参数
 * @return {string} import 代码
 */
export function generateStyleImport(descriptor, scopeId, options) {
  debug("generateStyleImport", descriptor, scopeId, options);

  let stylesImport = "var injectStyles = [];\n";

  const styles = descriptor.style;

  if (styles && styles.length) {
    for (let i = 0; i < styles.length; i++) {
      let style = styles[i];
      let isCSSModule = style.attribs.module !== undefined;

      const src = style.attribs.src || descriptor.filename;
      const idQuery = `&id=${scopeId}`;
      const srcQuery = style.attribs.src ? `&src` : ``;
      const attrsQuery = formatQuery(style.attribs, "css");
      const attrsQueryWithoutModule = attrsQuery.replace(
        /&module(=true|=[^&]+)?/,
        ""
      );
      const query = `?san&type=style&index=${i}${srcQuery}${idQuery}`;
      const resource = src + query + attrsQuery;
      const resourceWithoutModule = src + query + attrsQueryWithoutModule;

      stylesImport += options.esModule
        ? `import ${JSON.stringify(resource)};`
        : `require('${JSON.stringify(resource)}');`;
    }
  }

  return stylesImport

  // // 允许多个 <style> 标签
  // let injectStyles = [];
  // let styles = descriptor.style;
  // let code = "";

  // for (let i = 0; i < styles.length; i++) {
  //   let style = styles[i];
  //   let isCSSModule = style.attribs.module !== undefined;
  //   let resourcePath;
  //   let resourceQuery;

  //   if (style.attribs.src) {
  //     resourcePath = style.attribs.src;
  //     resourceQuery = { ...style.attribs };
  //     delete resourceQuery.src;
  //   } else {
  //     resourcePath = id.replace(/\\/g, "/");
  //     resourceQuery = Object.assign(style.attribs, {
  //       san: "",
  //       type: "style",
  //       index: i,
  //     });
  //   }
  //   resourcePath = resourcePath.replace(/\\/g, "/");
  //   let resource = `${resourcePath}?${qs.stringify(resourceQuery)}`;
  //   if (isCSSModule) {
  //     code += options.esModule
  //       ? `import style${i} from '${resource}&lang=.js';\nimport '${resource}&lang=.css';\n`
  //       : `var style${i} = require('${resource}&lang=.js');\nrequire('${resource}&lang=.css');\n`;
  //     injectStyles.push(`style${i}`);
  //   } else {
  //     code += options.esModule
  //       ? `import '${resource}&lang=.css';\n`
  //       : `require('${resource}&lang=.css');\n`;
  //   }
  // }
  // code += `var injectStyles = [${injectStyles.join(", ")}];\n`;

  // return stylesImport;
}

export async function getStyleCode(descriptor, query, options) {
  let code = `${options.esModule ? "export default" : "module.exports ="} `;

  const style = descriptor.style[query.index];
  return {
    code: style.content,
    map: {
      mappings: "",
    },
  };

  // const scopedID = `data-s-${hash(query.filename)}`;

  // const postcssResult = await cssModules(style.content);
  // const scopedCSS = await postcss([postcssPlugin(scopedID)]).process(
  //   style.content
  // ).css;

  // return {
  //   content:
  //     query.module !== undefined
  //       ? query.lang === ".js"
  //         ? `${code}${JSON.stringify(postcssResult.cssMap)}`
  //         : `${postcssResult.css}`
  //       : query.scoped
  //       ? `${scopedCSS}`
  //       : `${style.content}`,
  //   map: {
  //     mappings: "",
  //   },
  // };
}
