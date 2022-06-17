import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import checker from 'vite-plugin-checker';
import vConsole from 'vite-plugin-simple-vconsole';

// https://vitejs.dev/config/ for more info

// eslint: ran by checker
// pretty: builtin to stackblitz editor
// vue-tsc: ran by checker
export default defineConfig({
  plugins: [
    vue(),
    checker({
      eslint: {
        lintCommand: 'eslint . --ext .vue,.cjs,.ts --fix',
      },
      vueTsc: true,
    }),
    vConsole({
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // add this for debugging using "vite preview"
    sourcemap: true,
  },
  base: '',
});
