/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file entry.js
 * @description 生成导入语句
 */
import path from "path";
import { setDescriptor } from "../utils/descriptors";
import { generateTemplateImport } from "../blocks/template";
import { generateScriptImport } from "../blocks/script";
import { generateStyleImport } from "../blocks/style";

const { parseDocument } = require("htmlparser2");

const ELEMENT_TYPES = ["tag", "script", "style"];

/**
 * 获取 DOM AST
 *
 * @param {string} source 源文件
 * @param {Array} ast ast
 */
export function getAST(source) {
  const doc = parseDocument(source, {
    recognizeSelfClosing: true,
    withStartIndices: true,
    withEndIndices: true,
    lowerCaseAttributeNames: false,
  });
  return doc.children || [];
}

export function getContentRange(node, source) {
  let {startIndex, endIndex} = node;

  const max = source.length;
  const min = -1;

  while (startIndex < max && source[startIndex] !== '>') {
      startIndex++;
  }
  while (endIndex > min && source[endIndex] !== '<') {
      endIndex--;
  }
  startIndex++;
  endIndex--;

  // 当 script 中存在 类似 var a = '<div></div>' 的字符串时，htmlparser2 对于 script 块的 children endIndex 会标定到 var a = ' 的这个位置来，明显是错的。

  // let children = node.children;
  // let startIndex = children[0].startIndex;
  // let endIndex = children[children.length - 1].endIndex;
  return {startIndex, endIndex};
}

export function generateDescriptor(source) {
  let ast = getAST(source);

  let descriptor = {};
  for (let node of ast) {
    if (
      ELEMENT_TYPES.indexOf(node.type) > -1 &&
      ["template", "script", "style"].indexOf(node.name) > -1
    ) {
      const {startIndex, endIndex} = getContentRange(node, source);
      node.content = source.slice(startIndex, endIndex + 1);
      if (!descriptor[node.name]) {
        descriptor[node.name] = [];
      }
      descriptor[node.name].push(node);
    }
  }
  return { descriptor, ast };
}

export function generateEntryCode(source, id, options) {
  const descriptor = generateDescriptor(source).descriptor;
  setDescriptor(id, descriptor);

  const normalizePath = path.resolve("../../src/runtime/index.js");

  const code = `
  ${
    options.esModule
      ? `import normalize from '${normalizePath}';`
      : `var normalize = require('${normalizePath}').default;`
  }
  ${generateTemplateImport(descriptor, id, options)}
  ${generateScriptImport(descriptor, id, options)}
  ${generateStyleImport(descriptor, id, options)}

  ${
    options.esModule ? "export default" : "module.exports.default ="
  } normalize(script, template, injectStyles);`;

  return {
    code,
    map: {
      mappings: "",
    },
  };
}
