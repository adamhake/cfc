/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string
  readonly SANITY_STUDIO_DATASET: string
  readonly SANITY_STUDIO_API_VERSION: string
  readonly SANITY_STUDIO_PREVIEW_URL?: string
  readonly SANITY_STUDIO_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
