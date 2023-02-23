import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './note.schema';
import { RedisModule } from '../redis/redis.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'note', schema: NoteSchema }]),
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule { }
