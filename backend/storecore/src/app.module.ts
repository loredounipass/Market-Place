import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull'; // Importación agregada
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { CsrfModule } from './csrf/csrf.module';
import { TwoFactorAuthModule } from './two-factor/verification.module';
import { ProductModule } from './products/products.module';
import { LanguagesModule } from './languages/languages.module';

// This is the main application module that imports and configures various modules such as ConfigModule for environment variables, MongooseModule for MongoDB connection, ThrottlerModule for rate limiting, BullModule for Redis-based queues, and other feature modules like UserModule, WalletModule, AuthModule, TransactionModule, ProviderModule, and TwoFactorAuthModule. It also provides the AppService for handling application-level logic.
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: parseInt(process.env.RATE_LIMIT_TTL!),
        limit: parseInt(process.env.RATE_LIMIT!),
      }],
    }),

    MongooseModule.forRoot(process.env.DB_URI),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS || undefined,
      },
    }),
    RedisModule,
    CsrfModule,
    UserModule,
    AuthModule,
    TwoFactorAuthModule,
    ProductModule,
    LanguagesModule,
  ],
})
export class AppModule {}