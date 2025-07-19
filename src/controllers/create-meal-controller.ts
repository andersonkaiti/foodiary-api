import z from 'zod'
import { db } from '../db'
import { schema } from '../db/schemas'
import { mealsTable } from '../db/schemas/meals'
import type { HttpResponse, ProtectedHttpRequest } from '../types/http'
import { badRequest, ok } from '../utils/http'

const createMealSchema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
})

export class CreateMealController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = createMealSchema.safeParse(body)

    if (!success) {
      return badRequest({
        errors: error.issues,
      })
    }

    const [meal] = await db
      .insert(schema.meals)
      .values({
        userId,
        inputFileKey: 'input_file_key',
        inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
        status: 'uploading',
        icon: '',
        name: '',
        foods: [],
      })
      .returning({ id: mealsTable.id })

    return ok({ mealId: meal.id })
  }
}
