import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: [
        'src/index.ts',
        'src/table.ts',
        'src/table-store.ts',
        'src/table-context.ts',
        'src/table-context-element.ts',
        'src/field-definitions.ts',
        'src/react.ts',
        'src/global.ts'
      ],
      formats: ['es'],
    },
    target: "ES2015",
    rollupOptions: {
      external: [/^lit/, /^lit-svelte-stores/],
    },
  },
})
