import { eq } from 'drizzle-orm'
import { db } from '../db'
import { schema } from '../db/schemas'

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
      // chamar a IA
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
