import type { HttpRequest, HttpResponse } from '../types/http'
import { ok } from '../utils/http'

export class SignInController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return ok({
      statusCode: 200,
      body: {
        accessToken: 'token de acesso',
      },
    })
  }
}
