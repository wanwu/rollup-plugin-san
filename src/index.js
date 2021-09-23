/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
 */

import fs from "fs";
import hash from "hash-sum";
import postcss from "postcss";
import createDebugger from "debug";
import { createFilter } from "rollup-pluginutils";

import { generateEntryCode } from "./blocks/entry";
import { getTemplateCode } from "./blocks/template";
import { getScriptCode } from "./blocks/script";
import { getStyleCode } from "./blocks/style";

import { addScopeID } from "./transformers/transformTemplate";

import { setDescriptor, getDescriptor } from "./utils/descriptors";
import { parseQuery } from "./utils/query";
import defaultOptions from "./utils/options";
import postcssPlugin from "./utils/scopedCSS";

const debug = createDebugger("rollup-plugin-san");

const SAN_BLOCK_MAP = {
  template: getTemplateCode,
  style: getStyleCode,
  script: getScriptCode,
};

function extract(descriptor, query, options, id) {
  let extractor = SAN_BLOCK_MAP[query.type];
  return extractor(descriptor, options, query, id);
}

// SanPlugin 插件
export default function SanPlugin(userOptions = {}) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  const filter = createFilter(options.include, options.exclude);

  return {
    name: "san",

    async resolveId(id, entry) {
      const query = parseQuery(id);

      if (query.san) {
        if (query.src) {
          const resolved = await this.resolve(query.filename, entry, {
            // 防止无限循环
            skipSelf: true,
          });
          if (resolved) {
            setDescriptor(resolved.id, getDescriptor(entry));
            return resolved;
          }
        } else if (!filter(query.filename)) {
          return null;
        }
        debug(`resolveId(${id})`);
        return id;
      }
      // 不处理
      return null;
    },

    async load(id) {
      const query = parseQuery(id);

      if (query.san) {
        // src 引入外部文件，不用这里处理
        if (query.src) {
          return fs.readFileSync(query.filename, "utf-8");
        }
        const descriptor = getDescriptor(query.filename);

        if (descriptor) {
          const block = await extract(descriptor, query, options, id);

          if (block) {
            debug(`block code: (${block.content})`);
            return {
              code: block.content,
              map: block.map,
            };
          }
        }
      }
      return null;
    },

    async transform(code, id) {
      const query = parseQuery(id);

      // 入口 san 文件
      if (!query.san && filter(id)) {
        debug(`transform .san entry (${id})`);
        // 生成入口 import
        const output = generateEntryCode(code, id, options);

        if (output) {
          debug("入口 san 文件代码:", "\n" + output.code + "\n");
        }
        return output;
      }

      // 虚拟子块
      if (query.san) {
        if (!query.src && !filter(query.filename)) {
          return null;
        }
        if (query.src) {
          this.addWatchFile(query.filename);
        }
        if (query.type === "template") {
          debug(`transform template (${id}), with code\n${code}`);

          return {
            code: `export default \`${addScopeID(
              getDescriptor(query.filename).template[0].content,
              query.filename
            )}\``,
            map: {
              mappings: "",
            },
          };
          // return transformTemplate(code, id, options, query, this);
        } else if (query.type === "style") {
          debug(`transform style (${id}), with code\n${code}`);

          return {
            code,
            map: {
              mappings: "",
            },
          };
        }
      }
      return null;
    },
  };
}
