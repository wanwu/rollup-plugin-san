/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file style.js
 * @author clark-t
 */
import qs from "qs";
import cssModules from "../utils/cssModules";

import postcss from "postcss";
import postcssPlugin from "../utils/scopedCSS";
import hash_sum from "hash-sum";
/**
 * 根据 san 文件代码块生成对应 style 部分的 import 代码
 *
 * @param {Object} descriptor san 文件代码块描述对象
 * @param {Object} options 参数
 * @return {string} import 代码
 */
export function generateStyleImport(descriptor, id, options) {
  if (!descriptor.style || !descriptor.style.length) {
    return "var injectStyles = [];\n";
  }

  // 允许多个 <style> 标签
  let injectStyles = [];
  let styles = descriptor.style;
  let code = "";

  for (let i = 0; i < styles.length; i++) {
    let style = styles[i];
    let isCSSModule = style.attribs.module !== undefined;
    let resourcePath;
    let resourceQuery;

    if (style.attribs.src) {
      resourcePath = style.attribs.src;
      resourceQuery = { ...style.attribs };
      delete resourceQuery.src;
    } else {
      resourcePath = id.replace(/\\/g, "/");
      resourceQuery = Object.assign(style.attribs, {
        san: "",
        type: "style",
        index: i,
      });
    }
    resourcePath = resourcePath.replace(/\\/g, "/");
    let resource = `${resourcePath}?${qs.stringify(resourceQuery)}`;
    if (isCSSModule) {
      code += options.esModule
        ? `import style${i} from '${resource}&lang=.js';\nimport '${resource}&lang=.css';\n`
        : `var style${i} = require('${resource}&lang=.js');\nrequire('${resource}&lang=.css');\n`;
      injectStyles.push(`style${i}`);
    } else {
      code += options.esModule
        ? `import '${resource}&lang=.css';\n`
        : `require('${resource}&lang=.css');\n`;
    }
  }
  code += `var injectStyles = [${injectStyles.join(", ")}];\n`;
  return code;
}

export async function getStyleCode(descriptor, options, query) {
  let code = `${options.esModule ? "export default" : "module.exports ="} `;
  const style = descriptor.style[query.index];

  const postcssResult = await cssModules(style.content);
  const scopedCSS = await postcss([
    postcssPlugin(`data-s-${hash_sum(query.filename)}`),
  ]).process(style.content).css

  return {
    content:
      query.module !== undefined
        ? query.lang === ".js"
          ? `${code}${JSON.stringify(postcssResult.cssMap)}`
          : `${postcssResult.css}`
        : 
        query.scoped
        ? `${scopedCSS}`
        :`${style.content}`,
    map: {
      mappings: "",
    },
  };
}
