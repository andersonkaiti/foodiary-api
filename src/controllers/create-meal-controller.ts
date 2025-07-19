import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { s3Client } from '../clients/s3-client'
import { env } from '../config/env'
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

    const fileId = randomUUID()
    const ext = data.fileType === 'audio/m4a' ? '.m4a' : '.jpg'
    const fileKey = `${fileId}${ext}`

    const command = new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: fileKey,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    })

    const [meal] = await db
      .insert(schema.meals)
      .values({
        userId,
        inputFileKey: fileKey,
        inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
        status: 'uploading',
        icon: '',
        name: '',
        foods: [],
      })
      .returning({ id: mealsTable.id })

    return ok({
      mealId: meal.id,
      uploadURL: presignedUrl,
    })
  }
}
