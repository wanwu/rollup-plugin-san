/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file script.js
 * @description 根据 san 文件代码块生成对应 script 部分的 import 代码
 */

import createDebugger from "debug";

import { formatQuery } from "../utils/query";

const debug = createDebugger("rollup-plugin-san:blocks/script.js");

/**
 *
 * @param {*} descriptor
 * @param {*} scopeId
 * @param {*} options
 * @returns
 */
export function generateScriptImport(descriptor, scopeId, options) {
  debug("generateScriptImport", descriptor, scopeId, options);

  let scriptImport = "var script = {};\n";

  if (descriptor.script && descriptor.script.length) {
    const script = descriptor.script[0];

    const src = script.attribs.src || descriptor.filename;
    const srcQuery = script.attribs.src ? `&src` : ``;
    const attrsQuery = formatQuery(script.attribs, "js");
    const query = `?san&type=script${srcQuery}${attrsQuery}`;

    const resource = src + query;

    scriptImport = options.esModule
      ? `import script from '${resource}'
        export * from '${resource}'`
      : `var script = require('${resource}').default;
        module.exports = require('${resource}');`;
  }

  return scriptImport;
}

/**
 *
 * @param {*} descriptor
 * @param {*} options
 * @returns
 */
export function getScriptCode(descriptor, query, options) {
  const script = descriptor.script[0];

  return {
    code: script.content,
    map: {
      mappings: "",
    },
  };
}
