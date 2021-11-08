import qs from 'qs';
import { SFCBlock, SFCDescriptor } from 'san-sfc-compiler';

// file query
export type Query = Partial<
  SFCBlock & {
    filename: string;
    san?: false;
    index?: number;
    id?: string;
  }
>;

export function attrsToQuery(
  attrs: SFCBlock['attrs'],
  langFallback?: string,
  forceLangFallback = false
): string {
  let query = ``;
  for (const name in attrs) {
    const value = attrs[name];
    if (!['id', 'index', 'src', 'type', 'lang'].includes(name)) {
      query += `&${name}${value ? `=${String(value)}` : ``}`;
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

export function parseSanPartRequest(id: string): Query {
  const [filename, query] = id.split('?', 2);

  if (!query) return { san: false, filename };

  const raw = qs.parse(query);

  if ('san' in raw) {
    return {
      ...raw,
      filename,
      san: true,
      index: Number(raw.index),
      src: 'src' in raw,
      scoped: 'scoped' in raw,
    } as any;
  }

  return { san: false, filename };
}

// sourcemap
export interface StartOfSourceMap {
  file?: string;
  sourceRoot?: string;
}

export interface RawSourceMap extends StartOfSourceMap {
  version: string;
  sources: string[];
  names: string[];
  sourcesContent?: string[];
  mappings: string;
}

export function normalizeSourceMap(map: RawSourceMap, request: string): any {
  return null as any;
  if (!map) return null as any;

  if (!request.includes('type=script')) {
    map.file = request;
    map.sources[0] = request;
  }

  return {
    ...map,
    version: Number(map.version),
    mappings: typeof map.mappings === 'string' ? map.mappings : '',
  };
}

// sfc descriptor
const cache = new Map<string, SFCDescriptor | null>();

export function setDescriptor(id: string, entry: SFCDescriptor | null) {
  cache.set(id, entry);
}

export function getDescriptor(id: string) {
  if (cache.has(id)) {
    return cache.get(id)!;
  }
  return null;
}
