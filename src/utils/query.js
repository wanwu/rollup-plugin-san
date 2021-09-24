/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file query.js
 * @description querystring 解析文件请求
 */
import qs from "querystring";
import createDebugger from "debug";

const debug = createDebugger("rollup-plugin-san:uils/query.js");

const ignoreList = ["id", "index", "src", "type", "lang"];

/**
 * 
 * @param {*} id 
 * @returns 
 */
export function parseQuery(id) {
  debug("parseQuery：", id);

  const [filename, query] = id.split("?", 2);

  if (!query) return { san: false, filename };

  const parsed = qs.parse(query);

  if ("san" in parsed) {
    return {
      ...parsed,
      filename,
      san: true,
      src: "src" in parsed,
      scoped: "scoped" in parsed,
      // <style> 用
      index: Number(parsed.index),
    };
  }

  return { san: false, filename };
}

/**
 * 
 * @param {*} attrs 
 * @param {*} langFallback 
 * @param {*} forceLangFallback 
 * @returns 
 */
export function formatQuery(attrs, langFallback, forceLangFallback = false) {
  debug("formatQuery：", attrs, langFallback, forceLangFallback);

  let query = ``;
  for (const name in attrs) {
    const value = attrs[name];
    if (!ignoreList.includes(name)) {
      query += `&${qs.escape(name)}${
        value ? `=${qs.escape(String(value))}` : ``
      }`;
    }
  }
  if (langFallback || attrs.lang) {
    query +=
      `lang` in attrs
        ? forceLangFallback
          ? `&lang.${langFallback}`
          : `&lang.${attrs.lang}`
        : `&lang.${langFallback}`;
  }
  return query;
}
