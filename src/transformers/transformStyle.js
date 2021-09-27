/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file compileStyle.js
 * @description 添加 scopeid 和 css module 编译
 */

// 在这里处理所有样式代码，降低耦合性

import createDebugger from "debug";
import postcss from "postcss";
import postcssModules from "postcss-modules";

import postcssPlugin from "../utils/postcssPlugin";

const debug = createDebugger(
  "rollup-plugin-san:src/transformers/transformStyle.js"
);

export async function cssModules(css, options) {
  debug("cssModules");
  let result;
  let cssMap = {};

  let postcssResult = await postcss([
    postcssModules({
      getJSON: function (_, json) {
        cssMap = json;
      },
    }),
  ]).process(css, { from: undefined });
  result = Object.assign(postcssResult, { cssMap });

  return result;
}

/**
 * 预处理template增加属性，读出设置scoped的style模块重写选择器
 *
 * @param {string} source .san代码文本
 * @param {string} resourcePath 资源路径 for preparse
 * @return {string} 转换完的代码文本
 */
export async function addScopedIdInCSS(source, scopeId) {
  const { css } = await postcss([postcssPlugin(`data-s-${scopeId}`)]).process(source);

  return css;
}
