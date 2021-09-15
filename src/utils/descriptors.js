/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
 */

import createDebugger from "debug";

const debug = createDebugger("rollup-plugin-san");
const cache = new Map();

export function setDescriptor(id, entry) {
  debug("set descriptor %s", id);
  cache.set(id, entry);
}

export function getDescriptor(id) {
  debug("get descriptor %s", id);
  if (cache.has(id)) {
    return cache.get(id);
  }
  return null;
}
