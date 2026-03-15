/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ADDR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}