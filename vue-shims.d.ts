/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_DATA_VIRTUAL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
