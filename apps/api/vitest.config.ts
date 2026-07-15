import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
          exclude: [...configDefaults.exclude, '**/*.int.test.ts', '**/*.e2e.test.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'int',
          include: ['src/**/*.int.test.ts', 'tests/**/*.int.test.ts'],
          setupFiles: ['./tests/utils/setup/env.ts', './tests/utils/setup/db.ts'],
          fileParallelism: false
        }
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/**/*.e2e.test.ts', 'tests/**/*.e2e.test.ts'],
          setupFiles: ['./tests/utils/setup/env.ts', './tests/utils/setup/db.ts'],
          fileParallelism: false
        }
      }
    ]
  }
});
