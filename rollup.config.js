import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/pyx-hooks.ts',
  external: ['react', 'react-dom'],
  output: [
    {
      file: 'dist/pyx-hooks.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/pyx-hooks.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [typescript()]
};