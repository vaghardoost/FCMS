import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.register(), RedisModule, AdminModule, AuthModule],
})
export class AppModule {}
