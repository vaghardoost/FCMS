import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './admin.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    RedisModule,
  ],
})
export class AdminModule {}
