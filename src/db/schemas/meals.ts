import {
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const mealStatus = pgEnum('meal_status', [
  'uploading',
  'processing',
  'success',
  'failed',
])

export const mealInputType = pgEnum('meal_input_type', ['audio', 'picture'])

export const mealsTable = pgTable('meals', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  status: mealStatus().notNull(),
  inputType: mealInputType('input_type').notNull(),
  inputFileKey: varchar('input_file_key', { length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 100 }).notNull(),
  foods: json(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
