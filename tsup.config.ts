import { defineConfig } from 'tsup';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens/tokens.css',
    styles: 'src/styles/reset.css',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', 'prismjs'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  esbuildPlugins: [
    cssModulesPlugin({
      inject: false,
    }),
  ],
});