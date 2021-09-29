/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file template.js
 * @description 根据 san 文件代码块生成对应 template 部分的 import 代码
 */
import createDebugger from "debug";

import { getContent } from "../utils/content";
import { formatQuery } from "../utils/query";

const debug = createDebugger("rollup-plugin-san:blocks/template.js");

/**
 *
 * @param {*} descriptor
 * @param {*} scopeId
 * @param {*} options
 * @returns
 */
export function generateTemplateImport(descriptor, scopeId, options) {
  debug("generateTemplateImport", descriptor, scopeId, options);

  let templateImport = "var template;\n";

  if (descriptor.template && descriptor.template.length) {
    const template = descriptor.template[0];

    const src = template.attribs.src || descriptor.filename;
    const idQuery = `&id=${scopeId}`;
    const srcQuery = template.attribs.src ? `&src` : ``;
    const attrsQuery = formatQuery(template.attribs, "js", true);
    const query = `?san&type=template${idQuery}${srcQuery}${attrsQuery}`;

    const resource = src + query;

    templateImport = options.esModule
      ? `import template from '${resource}';`
      : `var template = require('${resource}');`;
  }

  return templateImport;
}

/**
 *
 * @param {*} descriptor
 * @param {*} options
 * @returns
 */
export function getTemplateCode(descriptor, _, options) {
  const code = `${options.esModule ? "export default" : "module.exports ="}`;
  const template = descriptor.template[0];

  const { map } = getContent(descriptor.source, template, {
    resourcePath: descriptor.filename,
    ast: descriptor.ast,
  });

  return {
    code: `${code} \`${template.content}\``,
    map,
  };
}
