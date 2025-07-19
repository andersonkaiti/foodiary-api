import { defineConfig } from 'drizzle-kit'
import { env } from './src/config/env'

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/db/schemas/**.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
