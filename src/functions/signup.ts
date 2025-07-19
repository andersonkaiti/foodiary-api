import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { SignUpController } from '../controllers/sign-up-controller'
import { parseEvent } from '../utils/parse-event'
import { parseResponse } from '../utils/parse-response'

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)

  const response = await SignUpController.handle(request)

  return parseResponse(response)
}
