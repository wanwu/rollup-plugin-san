# rollup-plugin-san

`rollup-plugin-san` 是一个支持 `.san` 单文件组件的 rollup 插件。

类似 webpack 的
[san-loader](https://github.com/ecomfe/san-loader) 插件，它同样支持以下特性：

- aNode, aPack

- scoped css

- css module

- less / sass 预处理（需要安装 `less` 及 `sass`）

- typescript（需要安装 `rollup-plugin-typescript2`）

等等。

## 快速上手

安装：

```shell
npm i rollup-plugin-san --save-dev
```

然后编写 `rollup.config.js`：

```js
import PluginSan from 'rollup-plugin-san';

export default [
  {
    input: 'src/App.san',
    output: {
      file: 'dist/app.js',
      format: 'esm',
      sourcemap: 'none',
    },
    plugins: [PluginSan()],
    external: ['san'],
  },
];
```

examples 里包含了绝大多数的开发场景的示例，比如热更新、压缩混淆、图片引入、ts 支持、copy 文件等等。

## 插件设置

|       Name        |                      Type                       | Default  | Description                                                                                                                                      |
| :---------------: | :---------------------------------------------: | :------: | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `compileTemplate` | `{'none'&#124;'aPack'&#124;'aNode'}` | `'none'` | 将组件的`template` 编译成`aPack`、`aNode`，**默认不编译**，[详细说明](https://github.com/ecomfe/san-loader#%E6%89%A9%E5%B1%95%E9%98%85%E8%AF%BB) |
|    `esModule`     |                   `{Boolean}`                   | `false`  | 使用 ESM 语法                                                                                                                                    |

## 注意事项

### 插件

- rollup 插件执行顺序和配置文件数组顺序是一致的，所以配置时候注意先后顺序

- css 的处理需要安装 rollup-plugin-postcss

- 一般来说 `@rollup/plugin-node-resolve` 是必备的，不然会出现找不到模块的问题

### 打包

- 分包，参考 example 的 prd.config.js，此时 san 可以通过 cdn 引入

- 全量打包需要 rollup commonjs 插件，并将 external 和 output.global 去掉，这样 san 才能全部打包到一起

### 其他

关于 sfc 写法可参考 webpack [san-loader](https://github.com/ecomfe/san-loader)，这里不再重复

## 反馈

所有 san 相关的项目都支持以下反馈方式：

- [san 讨论区](https://github.com/baidu/san/discussions)（推荐）

- 如流群 1582579

- github issue

## 协议

```txt
MIT License

Copyright (c) 2021 wanwu, Baidu Inc. All rights reserved.
```

## 参考

感谢以下项目：

- [rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

- [rollup-plugin-less](https://github.com/xiaofuzi/rollup-plugin-less)

- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)
