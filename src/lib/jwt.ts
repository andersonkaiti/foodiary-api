import { sign } from 'jsonwebtoken'
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
