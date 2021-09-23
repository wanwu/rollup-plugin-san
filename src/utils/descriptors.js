/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file descriptors.js
 * @description descriptors
 */

import createDebugger from "debug";

const debug = createDebugger("rollup-plugin-san");
const cache = new Map();

/**
 * 
 * @param {*} id 
 * @returns 
 */
export function getDescriptor(id) {
  debug("获取 descriptor 对象 %s：", id);

  if (cache.has(id)) {
    return cache.get(id);
  }

  return null;
}

/**
 * 
 * @param {*} id 
 * @param {*} entry 
 */
export function setDescriptor(id, entry) {
  debug("设置 descriptor 对象 %s：", id);

  cache.set(id, entry);
}
