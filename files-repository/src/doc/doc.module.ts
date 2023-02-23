import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../app.schema';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'file', schema: FileSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'kafka-client',
        imports: [ConfigModule, RedisModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'file',
              brokers: configService.get<string>('KAFKA_BROKERS').split(' ')
            },
            consumer: { groupId: 'file.doc' },
          }
        }),
      }
    ]),
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class DocModule { }
