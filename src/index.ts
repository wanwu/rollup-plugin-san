import fs from 'fs';

import { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { TemplateCompileOptions, StyleCompileOptions } from 'san-sfc-compiler';

import genEntry from './gencode/entry';
import transformTemplate from './transform/template';
import transformStyle from './transform/style';
import {
  getDescriptor,
  setDescriptor,
  parseSanPartRequest,
  normalizeSourceMap,
} from './utils';

export interface Options {
  include: string | RegExp | (string | RegExp)[];
  exclude: string | RegExp | (string | RegExp)[];
  templateCompileOptions?: TemplateCompileOptions;
  styleCompileOptions?: StyleCompileOptions;
  [key: string]: any;
}

const defaultOptions: Options = {
  include: /\.san$/,
  exclude: [],
};

export default function PluginSan(userOptions: Partial<Options> = {}): Plugin {
  const options: Options = {
    ...defaultOptions,
    ...userOptions,
  };

  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'san',
    async resolveId(id, importer) {
      const query = parseSanPartRequest(id);

      if (query.san) {
        if (query.src) {
          const resolved = await this.resolve(query.filename!, importer, {
            skipSelf: true,
          });
          if (resolved) {
            setDescriptor(resolved.id, getDescriptor(importer!));
            const [, originalQuery] = id.split('?', 2);
            resolved.id += `?${originalQuery}`;
            return resolved;
          }
        } else if (!filter(query.filename)) {
          return null;
        }
        return id;
      }

      return null;
    },

    load(id) {
      const query = parseSanPartRequest(id);

      if (query.san) {
        if (query.src) {
          return fs.readFileSync(query.filename!, 'utf-8');
        }
        const descriptor = getDescriptor(query.filename!);
        if (descriptor) {
          const block =
            query.type === 'template'
              ? descriptor.template!
              : query.type === 'script'
              ? descriptor.script!
              : query.type === 'style'
              ? descriptor.styles[query.index!]
              : null;

          if (block) {
            return {
              code: block.content,
              map: normalizeSourceMap(block.map, id),
            };
          }
        }
      }

      return null;
    },

    async transform(code, id) {
      const query = parseSanPartRequest(id);
      const descriptor = getDescriptor(query.filename!);

      // 生成入口
      if (!query.san && filter(id)) {
        return genEntry(code, id, options, process.cwd());
      }

      // 不同的块
      if (query.san) {
        if (!query.src && !filter(query.filename)) {
          return null;
        }
        if (query.src) {
          this.addWatchFile(query.filename!);
        }
        if (query.type === 'template') {
          const hasScoped = descriptor!.styles.some((s) => s.scoped);
          return transformTemplate(code, id, options, query, hasScoped);
        } else if (query.type === 'style') {
          return transformStyle(code, id, options, query);
        }
      }

      return null;
    },
  };
}

module.exports = PluginSan;
