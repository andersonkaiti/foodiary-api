import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '../db'
import { schema } from '../db/schemas'
import type { HttpResponse, ProtectedHttpRequest } from '../types/http'
import { badRequest, ok } from '../utils/http'

const getMealByIdSchema = z.object({
  mealId: z.uuid(),
})

export class GetMealByIdController {
  static async handle({
    userId,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = getMealByIdSchema.safeParse(params)

    if (!success) {
      return badRequest({
        errors: error.issues,
      })
    }

    const meal = await db.query.meals.findFirst({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
        status: true,
      },
      where: and(
        eq(schema.meals.id, data.mealId),
        eq(schema.meals.userId, userId)
      ),
    })

    return ok({
      meal,
    })
  }
}
