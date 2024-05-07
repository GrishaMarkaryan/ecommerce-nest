import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthSerializer } from './auth-serializer.provider'
import { GoogleAuthStrategy } from './google-auth.strategy'

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UserModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSerializer, GoogleAuthStrategy],
})
export class AuthModule {}
