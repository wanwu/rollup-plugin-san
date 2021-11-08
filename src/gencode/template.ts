import { SFCDescriptor } from 'san-sfc-compiler';

import { attrsToQuery } from '../utils';

export default (descriptor: SFCDescriptor, scopeId: string) => {
  const template = descriptor.template;
  let templateImport = `var template = '';`;

  if (template) {
    const src = template.src || descriptor.filename;
    const idQuery = `&id=${scopeId}`;
    const srcQuery = template.src ? `&src` : ``;
    const attrsQuery = attrsToQuery(template.attrs, 'js', true);
    const query = `?san&type=template${idQuery}${srcQuery}${attrsQuery}`;
    const templateRequest = JSON.stringify(src + query);
    templateImport = `import template from ${templateRequest}`;
  }

  return templateImport;
};
