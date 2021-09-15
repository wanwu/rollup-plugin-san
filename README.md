# rollup-plugin-san

A rollup plugin supports `.san` file.

## 背景

之前有业务同学反映，能不能在 rollup 中使用 .san 单文件组件开发，目前当然是不支持的。
而且出于拓展 san 的生态领域这一点，以后可能不仅仅只面向 webpack 一个打包工具。像 rollup 这种同样流行的工具是尽可能要支持的。

## 过程

### 1.rollup 插件开发

rollup 插件开发其实也和 webpack 类似，就是源代码=>转换=>目标代码。它提供了一些基本的钩子函数，用于 build 各个过程中调用。不过 rollup 没有 loader 和 plugin 的区分。一些常用的钩子：

```js
export function plugin(/* 任意参数，用于配置文件时候直接传过去 */) {
  return {
        // 插件名
    name: 'rollupPlugin',
    // 模块解析 id 时候，可以进行过滤
    resolveId(id, importer) {
            if (xxx) return null;
        }
        // 模块加载时候，可以自定义模块内容，或做一些中间处理
    load(id) {
      return readFile(id);
    },
        // 代码转换时候，传递的参数为待转换的代码和模块id
        async transform(code, id) {
            return code += '\n // test';
        }
        // 用来处理通过emitFile添加的urls或文件（动态添加的）
    resolveFileUrl({ relativePath, format }) {
      // 不同format会返回不同的文件解析地址
      return relativeUrlMechanisms[format](relativePath);
    }
  };
}
```

很多情况下其实只用 transform 就够了.

### 2.和 webpack loader 对比

项目 webpackrollup 表现类型一个调用 callback 的函数，参数为源代码 source 一个可以传任意格式的函数，返回一个对象，对象中包含若干会被调用的钩子返回值调用 callback 无返回，callback 参数是 转换后的代码和 sourcemap 返回代码和 sourcemapreturn { code: 'code', map: { mappings: 'mappings' }};核心依赖依赖于 webpack 对于资源的处理方式，如 loader 内联方式等等在对应钩子调用时处理资源即可使用方式需要 rules 正则匹配后缀，还可能考虑顺序直接 plugins 数组里调用即可，十分简单。也许考虑调用顺序
综上，写一个 rollup 插件还是比较简单的，成本很低。

### 3.rollup-plugin-less

以一个简单的实用的 less 插件为例：

```js
export default function plugin(options) {
  // 调用 rollup 提供的 createFilter 函数生成一个过滤资源的函数。
  // 在这里过滤了 include 选项提供的需要处理的后缀的，并且不在 node_modules 里的文件
  const filter = createFilter(
    options.include || ["**/*.less", "**/*.css"],
    options.exclude || "node_modules/**"
  );

  return {
    name: "less",
    async transform(code, id) {
      // 过滤
      if (!filter(id)) {
        return null;
      }
      try {
        // 转换
        let css = await less(code, options.option);
        // 返回的代码
        let exportCode = `export default ${JSON.stringify(css.toString())};`;
        return {
          code: exportCode,
          // 这里其实应该返回map。。。
          map: {
            mappings: "",
          },
        };
      } catch (error) {
        throw error;
      }
    },
  };
}
```

可以看到其实核心代码就在第 30 行，调用 less 转换代码。
其他的还有第 3 行，用来过滤 less 或 css 文件，这个类似 webpack 的 rules 的 test，只不过是写在插件自己里面了。

### 4.rollup-plugin-vue

其实 rollup-plugin-vue 很多地方实现方式和 san-loader 是差不多的，不过 san-loader 依赖于 webpack loader 机制，比如复用 rules，而 r 这个是碰到不认识的文件需要在插件里找，插件里自己去匹配，通过 include、exclude 这种 filter。
从 index.ts 开始，整个插件用了 resolveId load transform 三个生命周期钩子，通过虚拟文件和递归编译完成 sfc 的处理。

#### 1.resolved

首先在 resolveId 钩子函数里，对模块 id 进行处理，这一步主要是根据带有 querystring 的 id 进行处理，因为这些模块是插件自己生成的虚拟模块。
入口 vue 文件 vue 为 false 即是一个 entry 文件；如果有 vue 且为真说明是 vue 文件的一个 block。

```js
{
  vue: false,
  filename: '/Users/wangjinghao/Desktop/OpenSource/rollup-plugin-vue/examples/simple/src/App.vue'
}
在这里把 Descriptor 存上，方便之后用。
有的 vue 文件里把 js html css用 src方式引入，这里也进行了判断，有的话那就是这个文件自己的路径。（去掉了一些代码）
async resolveId(id, importer) {
  const query = parseVuePartRequest(id)
  if (query.vue) {
    if (query.src) {
      const resolved = await this.resolve(query.filename, importer, {
        skipSelf: true,
      })
      if (resolved) {
        setDescriptor(resolved.id, getDescriptor(importer!))
        return resolved
      }
    } else if (!filter(query.filename)) {
      return null
    }
    return id
  }
  return null
},
子块的解析后的query对象：
{
  vue: true,
  type: 'script',
  'lang.js': '',
  filename: '/Users/wangjinghao/Desktop/OpenSource/rollup-plugin-vue/examples/simple/src/App.vue',
  index: NaN,
  src: false,
  scoped: false
}
{
  vue: true,
  type: 'template',
  id: '7ba5bd90',
  'lang.js': '',
  filename: '/Users/wangjinghao/Desktop/OpenSource/rollup-plugin-vue/examples/simple/src/App.vue',
  index: NaN,
  src: false,
  scoped: false
}
```

#### 2.load

这一步是模块加载时运行的钩子。
在这里同样先处理一下 querystring，如果有 src 那就不用虚拟出一个文件，直接 readfile 返回内容就行，非 js 文件用其他插件处理，不用我们搞了。
然后如果是通过 query 虚拟出来的文件，那么根据 query type 返回 descriptor 的不同 block，这里和 webpack san-loader 一致。
最后返回代码内容和 sourcemap。

```js
load(id) {
  const query = parseVuePartRequest(id)
  if (query.vue) {
    if (query.src) {
      return fs.readFileSync(query.filename, 'utf-8')
    }
    const descriptor = getDescriptor(query.filename)
    if (descriptor) {
      const block =
        query.type === 'template'
          ? descriptor.template!
          : query.type === 'script'
          ? getResolvedScript(descriptor, isServer)
          : query.type === 'style'
          ? descriptor.styles[query.index]
          : typeof query.index === 'number'
          ? descriptor.customBlocks[query.index]
          : null

      if (block) {
        return {
          code: block.content,
          map: normalizeSourceMap(block.map, id),
        }
      }
    }
  }
  return null
}
```

#### 3.transform

这一步是主要用的对代码进行转换的步骤。
首先对 query 进行判断。如果没有 vue 并且符合 filter（过滤 .vue），说明是一个 vue 文件，即是一个入口文件，所以要对它进行处理。

```js
if (!query.vue && filter(id)) {
  debug(`transform SFC entry (${id})`);
  const output = transformSFCEntry(
    code,
    id,
    options,
    rootContext,
    isProduction,
    isServer,
    filterCustomBlock,
    this
  );
  return output;
}
```

transformSFCEntry 内容：

```js
let scriptImport =
  `import script from ${scriptRequest}\n` + `export * from ${scriptRequest}`; // support named exports
// ...
const output = [
  scriptImport,
  templateImport,
  stylesCode,
  customBlocksCode,
  renderReplace,
];
// ...
if (hasScoped) {
  output.push(`script.__scopeId = ${JSON.stringify(`data-v-${scopeId}`)}`);
}
// ...
return output;
```

可以看出这里和 san-loader 处理也是类似的，返回通过 query 表示的虚拟文件的代码的引入语句，从而递归调用插件。
其次，对子块进行处理，也就是代码转换：

```js
if (query.src) {
  this.addWatchFile(query.filename);
}
if (query.type === "template") {
  return transformTemplate(code, id, options, query, this);
} else if (query.type === "style") {
  return transformStyle(code, id, options, query, isProduction, this);
}
```

如果有 src 就添加到关注文件列表，不用这里处理；
如果是 template，就调用 transformTemplate；style 亦然。
那么 transformTemplate 做了什么呢：

```js
const result = compileTemplate({
  ...getTemplateCompilerOptions(options, descriptor, query.id),
  id: query.id,
  source: code,
  filename: query.filename,
});
return result;
```

可以看出，还是调用了 @vue/compiler-sfc 的 compileTemplate，实现添加 scopedid，ssr 参数等等功能。

## 结论

rollup-plugin-san 功能的实现方案如下：

### 1.block

vue 的插件中使用了 vue 自己的 @vue/compiler-sfc 内部包来提供编译功能，我们这里还需要引入 html parser 进行解析，返回不同区块，添加 scoped 属性；使用 magic string 实现 sourcemap 的功能。

### 2.css module

自己引入一个包 style-inject 来进行 css module 的引入。

### 3.scoped css

- 引入 postcss 直接处理
- 用 rollup postcss 插件，把 id 传过去
- 直接放在里面，只处理 html。
- 再写一个 san-anode-loader 时间成本有点高。

## 排期

时间任务备注 9.13-15 完成 sfc 解析基础功能 9.16scoped css / css module / compileTemplate 等额外功能 9.17 编写测试代码 9.18 编写插件示例预计本周发布

## 参考资料

1.rollup-plugin-vue
<https://rollup-plugin-vue.vuejs.org/>

2.rollup 插件开发
<https://chenshenhai.github.io/rollupjs-note/>

3.rollup-plugin-less
<https://github.com/xiaofuzi/rollup-plugin-less>

4.rollup vue example
<https://github.com/jonataswalker/vue-rollup-example>
