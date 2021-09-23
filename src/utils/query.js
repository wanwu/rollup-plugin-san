/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file query.js
 * @description querystring 解析文件请求
 */
import qs from "qs";

export function parseQuery(id) {
  // app.san?type=script&id=asdf78&compileTemplate=aNode
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
