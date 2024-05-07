import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ProductModule } from './product/product.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './common/config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoDbUri'),
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    //   TODO: Update Rate Limits to optimal values
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000 * 60,
        limit: 1000,
      },
      {
        name: 'long',
        ttl: 1000 * 60 * 15,
        limit: 15000,
      },
    ]),
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
