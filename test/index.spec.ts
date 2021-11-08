import PluginSan from '..';

describe('Rollup Plugin san', () => {
  describe('transform', () => {
    let transform;
    beforeEach(() => {
      transform = PluginSan().transform!;
    });

    it('should transform <script> block', async () => {
      const { code } = await transform(
        `<script>export default {}</script>`,
        `example.san`
      );

      expect(code).toEqual(
        expect.stringContaining(
          `import script from "example.san?san&type=script&id=063a6fa6&lang.js"`
        )
      );
      expect(code).toEqual(
        expect.stringContaining(
          `export * from "example.san?san&type=script&id=063a6fa6&lang.js\"`
        )
      );
      expect(code).toEqual(expect.stringContaining(`export default script`));
    });

    // it('should transform <script lang="ts"> block', async () => {
    //   const { code } = await transform(
    //     `<script lang="ts">export default {}</script>`,
    //     `example.san`
    //   );

    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import script from "example.san?san&type=script&lang.ts"`
    //     )
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `export * from "example.san?san&type=script&lang.ts"`
    //     )
    //   );
    //   expect(code).toEqual(expect.stringContaining(`export default script`));
    // });

    // it('should transform <template> block', async () => {
    //   const { code } = await transform(
    //     `<template><div /></template>`,
    //     `example.san`
    //   );

    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import { render } from "example.san?san&type=template&id=063a7d4c&lang.js"`
    //     )
    //   );
    //   expect(code).toEqual(expect.stringContaining(`script.render = render`));
    // });

    // it('should transform <template lang="pug"> block', async () => {
    //   const { code } = await transform(
    //     `<template>div</template>`,
    //     `example.san`
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import { render } from "example.san?san&type=template&id=063a7d4c&lang.js"`
    //     )
    //   );
    //   expect(code).toEqual(expect.stringContaining(`script.render = render`));
    // });

    // it('should transform <style> block', async () => {
    //   const { code } = await transform(`<style>.foo {}</style>`, `example.san`);
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import "example.san?san&type=style&index=0&id=063a7d4c&lang.css"`
    //     )
    //   );
    // });

    // it('should transform <style scoped> block', async () => {
    //   const { code } = await transform(
    //     `<style scoped>.foo {}</style>`,
    //     `example.san`
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import "example.san?san&type=style&index=0&id=063a7d4c&scoped=true&lang.css`
    //     )
    //   );
    // });

    // it('should transform <style module> block', async () => {
    //   const { code } = await transform(
    //     `<style module>.foo {}</style>`,
    //     `example.san`
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import "example.san?san&type=style&index=0&id=063a7d4c&lang.css`
    //     )
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import style0 from "example.san?san&type=style&index=0&id=063a7d4c&module=true&lang.css`
    //     )
    //   );
    //   expect(code).toEqual(expect.stringContaining('script.__cssModules = {}'));
    //   expect(code).toEqual(
    //     expect.stringContaining('cssModules["$style"] = style0')
    //   );
    // });

    // it('should transform <style module="custom"> block', async () => {
    //   const { code } = await transform(
    //     `<style module="custom">.foo {}</style>`,
    //     `example.san`
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import "example.san?san&type=style&index=0&id=063a7d4c&lang.css`
    //     )
    //   );
    //   expect(code).toEqual(
    //     expect.stringContaining(
    //       `import style0 from "example.san?san&type=style&index=0&id=063a7d4c&module=custom&lang.css`
    //     )
    //   );
    //   expect(code).toEqual(expect.stringContaining('script.__cssModules = {}'));
    //   expect(code).toEqual(
    //     expect.stringContaining('cssModules["custom"] = style0')
    //   );
    // });

    // it.skip('should transform multiple <style module> block', async () => {
    //   await transform(
    //     `<style module>.foo {}</style>
    //       <style module>.bar {}</style>`,
    //     `example.san`
    //   );
    // });
  });
});
