import { Readable } from 'node:stream'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { s3Client } from '../clients/s3-client'
import { env } from '../config/env'
import { db } from '../db'
import { schema } from '../db/schemas'
import { transcribeAudio } from '../services/ai'

export class ProcessMeal {
  static async process({ fileKey }: { fileKey: string }) {
    const meal = await db.query.meals.findFirst({
      where: eq(schema.meals.inputFileKey, fileKey),
    })

    if (!meal) {
      throw new Error('Meal not found.')
    }

    if (meal.status === 'failed' || meal.status === 'success') {
      return
    }

    await db
      .update(schema.meals)
      .set({ status: 'processing' })
      .where(eq(schema.meals.id, meal.id))

    try {
      if (meal.inputType === 'audio') {
        const command = new GetObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: meal.inputFileKey,
        })

        const { Body } = await s3Client.send(command)

        if (!(Body && Body instanceof Readable)) {
          throw new Error('Cannot load the audio file.')
        }

        const chunks: Buffer[] = []

        for await (const chunk of Body) {
          chunks.push(chunk)
        }

        const audioFileBuffer = Buffer.concat(chunks)

        const transcription = await transcribeAudio(audioFileBuffer)

        console.log({ transcription })
      }

      await db
        .update(schema.meals)
        .set({
          status: 'success',
          name: 'Café da manhã',
          icon: '🍞',
          foods: [
            {
              name: 'Pão',
              quantity: '2 fatias',
              calories: 100,
              proteins: 200,
              carbohydrates: 300,
              fats: 400,
            },
          ],
        })
        .where(eq(schema.meals.id, meal.id))
    } catch {
      await db
        .update(schema.meals)
        .set({
          status: 'failed',
        })
        .where(eq(schema.meals.id, meal.id))
    }
  }
}
