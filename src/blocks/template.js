/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file template.js
 * @description 生成 template code 导入
 */
import qs from "qs";

export function generateTemplateImport(descriptor, id, options) {
  if (!descriptor.template || !descriptor.template.length) {
    return "var template;";
  }

  let template = descriptor.template[0];
  let resource;

  if (template.attribs.src) {
    resource = template.attribs.src;
  } else {
    let resourcePath = id.replace(/\\/g, "/");
    let query = Object.assign(
      {
        lang: "html",
      },
      template.attribs,
      {
        san: "",
        type: "template",
        // TODO
        "": "fake.js",
      }
    );
    resource = `${resourcePath}?${qs.stringify(query)}`;
  }
  return options.esModule
    ? `import template from '${resource}';`
    : `var template = require('${resource}');`;
}

export function getTemplateCode(descriptor, options) {
  let code = `${options.esModule ? "export default" : "module.exports ="} `;

  const template = descriptor.template[0];

  return {
    content: `${code}\`${template.content}\``,
    map: {
      mappings: "",
    },
  };
}
