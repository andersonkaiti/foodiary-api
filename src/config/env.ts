import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgresql'),
  JWT_SECRET: z.string(),
  BUCKET_NAME: z.string(),
  MEALS_QUEUE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
