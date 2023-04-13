import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisAdminService } from './redis.service.admin';
import RedisTicketService from './redis.service.ticket';

@Module({
  providers: [RedisService, RedisAdminService, RedisTicketService],
  exports: [RedisAdminService, RedisTicketService],
})
export class RedisModule { }
