import { eq } from 'drizzle-orm'
import { db } from '../db'
import { schema } from '../db/schemas'
import type { HttpResponse, ProtectedHttpRequest } from '../types/http'
import { ok } from '../utils/http'

export class MeController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        name: true,
        calories: true,
        proteins: true,
        carbohydrates: true,
        fats: true,
      },
      where: eq(schema.users.id, userId),
    })  

    return ok({ user })
  }
}
