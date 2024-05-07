import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as passport from 'passport'
import { createClient } from 'redis'
import RedisStore from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  //TODO: Check this
  app.use(helmet())

  app.enableCors({
    origin: [configService.get<string>('frontendUrl')],
    credentials: true,
  })

  app.use(cookieParser())
  app.setGlobalPrefix('api')

  const redisClient = createClient({
    url: configService.get<string>('redisUri'),
  })
  await redisClient.connect()

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: configService.get<string>('sessionSecret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // TODO: Use true in production with HTTPS
        httpOnly: true,
        sameSite: 'lax', // TODO: use strict in production
        maxAge: 3600000, // 1 hour
      },
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(configService.get<number>('port'))
}

bootstrap()
