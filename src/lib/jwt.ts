import { type JwtPayload, sign, verify } from 'jsonwebtoken'
import { env } from '../config/env'

export function signAccessTokenFor(userId: string) {
  const accessToken = sign(
    {
      sub: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: '3d',
    }
  )

  return accessToken
}

export function validateAccessToken(token: string) {
  try {
    const { sub } = verify(token, env.JWT_SECRET) as JwtPayload

    return sub ?? null
  } catch {
    return null
  }
}
