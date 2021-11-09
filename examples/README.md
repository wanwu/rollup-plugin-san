# examples

## 说明

1. `package.json` 里使用了 `link:../../` 来导入 `rollup-plugin-san`，安装时候需要使用 `yarn`，因为 `npm` 不认识这个命令

2. 默认输出都是 ESM 格式，主要是因为 测试也会用到编译结果，有需要可以自己更改输出格式或者添加转换器

3. 如果 ts 相关组件报错，请尝试修改 `typescript` 或 `rollup-plugin-typescript2` 版本
