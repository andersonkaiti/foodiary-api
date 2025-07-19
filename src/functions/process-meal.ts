import type { SQSEvent } from 'aws-lambda'
import { ProcessMeal } from '../queues/process-meal'

export async function handler(event: SQSEvent) {
  await Promise.all(
    event.Records.map(async (record) => {
      const body = JSON.parse(record.body)

      await ProcessMeal.process(body)
    })
  )
}
