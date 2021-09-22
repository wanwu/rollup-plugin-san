/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file compileStyle.js
 * @description 编译 style 标签的插值替换
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

  let hasScope = false;

  for (let node of ast) {
    if (
      node.name === "style" &&
      node.attribs &&
      Reflect.has(node.attribs, "scoped")
    ) {
      hasScope = true;
      if (node.children && node.children.length) {
        node.children[0].data = postcss([
          postcssPlugin(`data-s-${id}`),
        ]).process(node.children[0].data).css;
      }
    }
  }

  for (let node of ast) {
    if (
      hasScope &&
      node.name === "template" &&
      node.children &&
      node.children.length
    ) {
      for (let tag of node.children) {
        tag.type === "tag" && addId(tag, id);
      }
    }
  }

  return render(ast, {
    decodeEntities: false,
  });
}
