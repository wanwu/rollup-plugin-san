/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file script.js
 * @description 根据 san 文件代码块生成对应 script 部分的 import 代码
 */
/**
 * 根据 san 文件代码块生成对应 script 部分的 import 代码
 *
 * @param {Object} descriptor san 文件代码块描述对象
 * @param {Object} options 参数
 * @return {string} import 代码
 */

import qs from "qs";

export function generateScriptImport(descriptor, id, options) {
  if (!descriptor.script || !descriptor.script.length) {
    return "var script = {};";
  }

  let script = descriptor.script[0];
  let resource;

  if (script.attribs.src) {
    resource = script.attribs.src;
  } else {
    let resourcePath = id.replace(/\\/g, "/");
    let query = Object.assign(
      {
        lang: "js",
      },
      script.attribs,
      {
        san: "",
        type: "script",
        // TODO
        "": "fake.js",
      }
    );
    resource = `${resourcePath}?${qs.stringify(query)}`;
  }

  return `
        ${
          options.esModule
            ? `import script from '${resource}';`
            : `var script = require('${resource}').default;`
        }
        ${
          options.esModule
            ? `export * from '${resource}';`
            : `module.exports = require('${resource}');`
        }
    `;
}

export function getScriptCode(descriptor, options) {
  const script = descriptor.script[0];

  return {
    content: script.content,
    map: {
      mappings: "",
    },
  };
}
