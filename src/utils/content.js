/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
 */

import path from "path";
import MagicString  from "magic-string";

import debug from "debug";
/**
 * 深度遍历
 *
 * @param {Array} arr 根节点
 * @param {Function} callback 回调，参数为当前遍历到的节点对象，函数返回 false 时终止遍历
 */
function traverse(arr, callback) {
  let stack = arr.slice().reverse();
  while (stack.length) {
    let node = stack.pop();
    let result = callback(node);
    if (result === false) {
      break;
    }
    if (node.children && node.children.length) {
      for (let i = node.children.length - 1; i > -1; i--) {
        stack.push(node.children[i]);
      }
    }
  }
}

/**
 * 字符串操作工具，能够生成操作后的字符串以及对应的 sourcemap
 *
 * @param {string} code 代码
 * @param {Array} ast 代码对应的 ast
 * @return {MagicString} MagicString 对象
 */
function stringManager(code, ast) {
  let s = new MagicString(code);
  // 给字符串标记上 sourcemap 点位
  traverse(ast, (node) => {
    if (node && node.type !== "comment") {
      s.addSourcemapLocation(node.startIndex);
      if (
        node.children &&
        node.children[0] &&
        node.children[0].startIndex != null
      ) {
        s.addSourcemapLocation(node.children[0].startIndex - 1);
      }
    }
  });

  return s;
}

export function getContentRange(node, source) {
  debug('getContentRange: ', source);

  let { startIndex, endIndex } = node;

  const max = source.length;
  const min = -1;

  while (startIndex < max && source[startIndex] !== ">") {
    startIndex++;
  }
  while (endIndex > min && source[endIndex] !== "<") {
    endIndex--;
  }
  startIndex++;
  endIndex--;

  return { startIndex, endIndex };
}
