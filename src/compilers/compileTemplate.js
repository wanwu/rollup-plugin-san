/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file compileTemplate.js
 * @description 处理template块的代码
 */

import hash from "hash-sum";
import postcss from "postcss";
import render from "dom-serializer";

import { getAST } from "../blocks/entry";
import postcssPlugin from "../utils/scopedCSS";

const addId = (node, id) => {
  if (!node.attribs) {
    node.attribs = {};
  }
  node.attribs[`data-s-${id}`] = "";
  if (node.children) {
    node.children.map((c) => addId(c, id));
  }
  return node;
};

/**
 * 预处理template增加属性，读出设置scoped的style模块重写选择器
 *
 * @param {string} source .san代码文本
 * @param {string} resourcePath 资源路径 for preparse
 * @return {string} 转换完的代码文本
 */
export default function (source, resourcePath) {
  const id = hash(resourcePath);
  let ast = getAST(source);
  
  for (let node of ast) {
    node.type === "tag" && addId(node, id);
  }

  return render(ast, {
    decodeEntities: false,
  });
}