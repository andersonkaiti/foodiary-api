import { drizzle } from 'drizzle-orm/neon-http'
import { env } from '../config/env'
import { schema } from './schemas/index'

export const db = drizzle(env.DATABASE_URL, {
  schema,
})
