/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 */

/**
 * 处理 sourcemap
 * @param {*} map
 * @param {*} request
 * @returns
 */
export default function (map, request) {
  if (!map) return null;

  if (!request.includes("type=script")) {
    map.file = request;
    map.sources[0] = request;
  }

  return {
    ...map,
    mappings: typeof map.mappings === "string" ? map.mappings : "",
  };
}
