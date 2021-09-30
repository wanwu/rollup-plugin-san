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

import hash from "hash-sum";
import createDebugger from "debug";
import { parseDocument } from "htmlparser2";

import { generateTemplateImport } from "../blocks/template";
import { generateScriptImport } from "../blocks/script";
import { generateStyleImport } from "../blocks/style";
import { setDescriptor } from "../utils/descriptors";
import { getContentRange } from "../utils/content";

const debug = createDebugger("rollup-plugin-san:blocks/entry.js");

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

/**
 *
 * @param {*} source
 * @returns
 */
export function generateDescriptor(source, filename) {
  const ast = getAST(source);
  const descriptor = {};

  for (let node of ast) {
    if (
      ELEMENT_TYPES.indexOf(node.type) > -1 &&
      ["template", "script", "style"].indexOf(node.name) > -1
    ) {
      const { startIndex, endIndex } = getContentRange(node, source);
      node.content = source.slice(startIndex, endIndex + 1);

      if (!descriptor[node.name]) {
        descriptor[node.name] = [];
      }
      descriptor[node.name].push(node);
    }
  }

  descriptor.filename = filename;
  descriptor.source = source;
  descriptor.ast = ast;

  return descriptor;
}

/**
 *
 * @param {*} source
 * @param {*} query
 * @param {*} options
 * @returns
 */
export function generateEntryCode(source, query, options) {
  debug("生成入口：", source, query, options);

  const filename = query.filename;
  const scopeId = hash(filename);

  const descriptor = generateDescriptor(source, query.filename);
  // 缓存以提高性能
  setDescriptor(filename, descriptor);

  const normalizePath = path.resolve("../src/runtime/index.js");
  const normalizeImport = `${
    options.esModule
      ? `import normalize from '${normalizePath}';`
      : `var normalize = require('${normalizePath}').default;`
  }`;

  const templateImport = generateTemplateImport(descriptor, scopeId, options);
  const scriptImport = generateScriptImport(descriptor, scopeId, options);
  const stylesImport = generateStyleImport(descriptor, scopeId, options);

  const normalizeExport = `${
    options.esModule ? "export default" : "module.exports.default ="
  } normalize(script, template, injectStyles);`;

  const output = [
    normalizeImport,
    templateImport,
    scriptImport,
    stylesImport,
    normalizeExport,
  ];

  return {
    code: output.join("\n"),
    map: {
      mappings: "",
    },
  };
}
