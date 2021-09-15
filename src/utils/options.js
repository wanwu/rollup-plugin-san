/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
 */

export default {
  include: /\.san$/,
  exclude: ["node_modules/**"],
  target: "browser",
  exposeFilename: false,

  // utils
  compileTemplate: 'none',
  esModule: false,
};
