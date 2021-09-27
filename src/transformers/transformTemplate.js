/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file compileTemplate.js
 * @description 处理template块的代码，功能包括添加 scopeid 和 anode、apack 编译 以及资源 uri 转换
 */

import createDebugger from "debug";
import hash from "hash-sum";
import render from "dom-serializer";
import aNodeUtils from "san-anode-utils";

import { getAST } from "../blocks/entry";

const debug = createDebugger(
  "rollup-plugin-san:transformers/transformTemplate.js"
);

const compileTemplateTypes = ["aPack", "aNode", "none"];

/**
 *
 * @param {*} source
 * @param {*} query
 * @param {*} options
 * @returns
 */
export function compileTemplate(source, query, options) {
  let code = source;
  // 优先使用template上面的compileTemplate
  const compileTpl = query.compileTemplate || options.compileTemplate;
  if (compileTpl && compileTemplateTypes.includes(compileTpl)) {
    if (query.lang !== "html") { // rollup-plugin-san
      throw new Error(
        "attribute `compileTemplate` can only used when `lang` is `html`"
      );
    }

    const aNode = aNodeUtils.parseTemplate(source);

    debug("启动 compileTemplate 功能：", aNode);

    switch (compileTpl) {
      case "aNode":
        code = JSON.stringify(aNode);
        break;
      case "aPack":
        if (aNode.children.length) {
          const aPack = aNodeUtils.pack(aNode.children[0]);
          code = JSON.stringify(aPack);
        }
        break;
      case "none":
      default:
        break;
    }
  }

  return `${options.esModule ? "export default" : "module.exports ="} ${code}`;
}

/**
 * 预处理template增加属性，读出设置scoped的style模块重写选择器
 * @param {*} source 
 * @param {*} scopedId 
 * @returns 
 */
export function addScopedIdInTemplate(source, scopedId) {
  const ast = getAST(source);

  for (let node of ast) {
    node.type === "tag" && addId(node, scopedId);
  }

  return render(ast, {
    decodeEntities: false,
  });
}

/**
 *
 * @param {*} root
 * @param {*} id
 * @returns
 */
function addId(root, id) {
  if (!root.attribs) {
    root.attribs = {};
  }

  root.attribs[`data-s-${id}`] = "";

  if (root.children) {
    root.children.map((node) => addId(node, id));
  }

  return root;
}
