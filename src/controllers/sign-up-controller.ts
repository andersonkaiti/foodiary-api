import type { HttpRequest, HttpResponse } from '../types/http'

export class SignUpController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 201,
      body: {
        accessToken: 'sign up: token de acesso',
      },
    }
  }
}
