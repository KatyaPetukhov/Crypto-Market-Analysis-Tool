import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'http://localhost:3001/api-docs',
  apiFile: './src/Redux/EmptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './src/Redux/Api.ts',
  exportName: 'api',
  hooks: true,
  tag: true,
}

export default config