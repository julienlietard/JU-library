import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js', // Point d'entrée de ta bibliothèque
  output: [
    {
      file: 'dist/index.cjs.js', // Format CommonJS (utilisé par Node)
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // Format ES Module (utilisé par les bundlers modernes)
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    postcss({
      extensions: ['.css'],
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
    terser(), // Minifier pour réduire la taille du bundle
  ],
  external: ['react', 'react-dom'], // Peer dependencies à exclure du bundle
};