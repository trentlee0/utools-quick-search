/// <reference types="vite/client" />

declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@jamescoyle/vue-icon' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module globalThis {
  export function open(query: string, app?: string): void
  export function existsFile(path: string): boolean
}
