import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '../db'
import { schema } from '../db/schemas'
import type { HttpRequest, HttpResponse } from '../types/http'
import { badRequest, ok, unauthorized } from '../utils/http'

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = signInSchema.safeParse(body)

    if (!success) {
      return badRequest({
        errors: error.issues,
      })
    }

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: eq(schema.users.email, data.email),
    })

    if (!user) {
      return unauthorized({ error: 'Invalid credentials.' })
    }

    const isPasswordValid = await compare(data.password, user.password)

    if (!isPasswordValid) {
      return unauthorized({ error: 'Invalid credentials.' })
    }

    return ok({
      data,
    })
  }
}
