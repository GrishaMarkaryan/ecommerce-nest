import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { Profile } from 'passport'
import { UserService } from '../user/user.service'

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('google.clientId'),
      clientSecret: configService.get<string>('google.clientSecret'),
      callbackURL: 'http://localhost:8000/api/auth/google/callback',
      scope: ['email', 'profile'],
      prompt: 'consent',
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const { displayName, emails, id } = profile
    const user = await this.userService.upsertWithGoogleInfo(
      displayName,
      emails?.[0].value ?? '',
      id
    )

    done(null, user)
  }
}
