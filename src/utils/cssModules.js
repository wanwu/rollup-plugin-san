import postcss from "postcss";
import postcssModules from "postcss-modules";

export default async function cssModules(css, options) {
  let cssMap = {};
  
  let postcssResult = await postcss([
    postcssModules({
      getJSON: function (_, json) {
        cssMap = json;
      },
    }),
  ]).process(css, { from: undefined });

  return Object.assign(postcssResult, { cssMap });
}
