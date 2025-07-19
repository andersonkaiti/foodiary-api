import { and, eq, gte, lte } from 'drizzle-orm'
import z from 'zod'
import { db } from '../db'
import { schema } from '../db/schemas'
import type { HttpResponse, ProtectedHttpRequest } from '../types/http'
import { badRequest, ok } from '../utils/http'

const listMealsSchema = z.object({
  date: z.iso.date().transform((dateStr) => new Date(dateStr)),
})

export class ListMealsController {
  static async handle({
    userId,
    queryParams,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = listMealsSchema.safeParse(queryParams)

    if (!success) {
      return badRequest({
        errors: error.issues,
      })
    }

    const endDate = new Date(data.date)
    endDate.setUTCHours(23, 59, 59, 59)

    const meals = await db.query.meals.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: and(
        eq(schema.meals.userId, userId),
        eq(schema.meals.status, 'success'),
        gte(schema.meals.createdAt, data.date),
        lte(schema.meals.createdAt, endDate)
      ),
    })

    return ok({
      meals,
    })
  }
}
