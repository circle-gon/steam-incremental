/// <reference types="vite/client" />

import { steam } from './data/steam';

declare global {
  interface Window {
    steam: typeof steam;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
