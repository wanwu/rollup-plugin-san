# rollup-plugin-san

`rollup-plugin-san` 是一个支持 `.san` 单文件组件的 rollup 插件。

![rollup-plugin-san](https://user-images.githubusercontent.com/20496444/140854195-56a6a455-58a9-499a-84a4-1ddce67319a0.png)

类似 webpack 的
[san-loader](https://github.com/ecomfe/san-loader) 插件，它同样支持以下特性：

- scoped css

- css modules

- less 等 css 预处理器（需要自行安装配套包）

- pug 等 html 预处理器（需要自行安装配套包）

- typescript 等 js 方言（需要自行安装配套包）

- aNode / aPack => [文档](https://github.com/baidu/san/blob/master/doc/anode.md)

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

## 设置

| 名称                   | 描述                 | 类型                                   |
| ---------------------- | -------------------- | -------------------------------------- |
| include                | 包含的文件或目录     | string / RegExp / (string / RegExp)[]; |
| exclude                | 排除的文件或目录     | string / RegExp / (string / RegExp)[]; |
| templateCompileOptions | compileTemplate 选项 | Object                                 |
| styleCompileOptions    | compileStyle 选项    | Object                                 |

templateCompileOptions 和 styleCompileOptions 详见 [san-sfc-compiler](https://github.com/wanwu/san-sfc-compiler/)

## 说明

### 插件

- rollup 插件执行顺序和配置文件数组顺序是一致的，所以配置时候注意先后顺序

- css 的处理需要安装 rollup-plugin-postcss

- 一般来说 `@rollup/plugin-node-resolve` 是必备的，不然会出现找不到模块的问题

- 默认输出 ESM 模块，可自行配置 babel 来转换语法

### 打包

- 分包，参考 examples/complex 的 rollup.config.js，此时 san 可以通过 cdn 引入

- 全量打包需要 rollup 的 commonjs 插件，并将 external 和 output.global 去掉，这样 san 才能全部打包到一起

### 其他

关于 sfc 写法可参考 webpack [san-loader](https://github.com/ecomfe/san-loader)，这里不再重复

## 反馈

所有 san 相关的项目都支持以下反馈方式：

- [san 讨论区](https://github.com/baidu/san/discussions)

- 如流群 1582579

- [Issue](https://github.com/wanwu/rollup-plugin-san/issues)

## 协议

```txt
MIT. Copyright (c) Baidu Inc. All rights reserved.
```

## 参考

感谢以下项目：

- [rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

- [rollup-plugin-less](https://github.com/xiaofuzi/rollup-plugin-less)

- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)
