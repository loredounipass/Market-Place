import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASS?.trim() || undefined,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryStrategy: () => null,
        });

        client.on('error', (err) => {
          console.error('[Redis Global] Error:', err.message);
        });

        try {
          await client.connect();
        } catch {
          console.warn('[Redis Global] Redis not available, continuing without it.');
        }

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async onModuleDestroy() {
    if (this.redisClient && typeof this.redisClient.quit === 'function') {
      await this.redisClient.quit();
    }
  }
}
