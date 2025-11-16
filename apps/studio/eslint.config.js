import sanityConfig from '@sanity/eslint-config-studio'

export default [
  {
    ignores: ['dist', '.sanity', 'node_modules', 'sanity.types.ts'],
  },
  ...sanityConfig,
]
