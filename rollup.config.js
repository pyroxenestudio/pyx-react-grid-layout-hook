import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/usePyxReactGridLayout.hook.ts',
  output: [
    {
      file: 'dist/usePyxReactGridLayout.hook.js',
      format: 'esm'
    },
    {
      file: 'dist/usePyxReactGridLayout.hook.cjs',
      format: 'cjs'
    }
  ],
  plugins: [typescript()]
};