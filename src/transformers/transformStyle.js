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
import less from "less";
import postcss from "postcss";
import postcssModules from "postcss-modules";

import postcssPlugin from "../utils/postcssPlugin";

const debug = createDebugger(
  "rollup-plugin-san:src/transformers/transformStyle.js"
);

export async function preProcessLess(css) {
  // 处理如同时使用 less 及 css modules 的情况
  debug("在最前面预处理 less");

  let result = css;
  less.render(css, function (e, output) {
    if (e) throw new Error(e);
    else result = output.css;
  });

  return result;
}

export async function cssModules(css, options) {
  debug("cssModules");

  let cssHash;
  let postcssResult = await postcss([
    postcssModules({
      getJSON: function (_, json) {
        cssHash = json;
      },
    }),
  ]).process(css, { from: undefined });
  const result = Object.assign(postcssResult, { cssHash });

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
  const { css } = await postcss([postcssPlugin(`data-s-${scopeId}`)]).process(
    source,
    { from: undefined }
  );

  return css;
}
