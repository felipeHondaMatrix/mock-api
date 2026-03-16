import { defineConfig } from 'orval';

export default defineConfig({
  eprFlowControlApi: {
    input: {
      target: './swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/generated/epr-flow-control-api',
      schemas: 'src/generated/epr-flow-control-api/model',
      client: 'axios',
      baseUrl: 'https://dev-api.internal.matrixenergia.com/epr-flow-control-api',
      override: {
        mutator: {
          path: 'src/generated/axios-instance.ts',
          name: 'customAxiosInstance',
        },
      },
    },
  },
});
