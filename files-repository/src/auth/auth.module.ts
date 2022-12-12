import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { AuthGuard } from './auth.guard';
import { readFileSync } from 'fs';
import { ConfigModel } from 'src/config/config.model';

@Module({})
export class AuthModule {
  static register(): DynamicModule{
    const data: string = readFileSync('config.json', { encoding: 'utf-8' });
    const config:ConfigModel = JSON.parse(data);
    return {
      module:AuthModule,
      imports: [
        ConfigModule,
        ClientsModule.register([
          {
            name: 'kafka-client',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'file',
                brokers: config.kafka.brokers,
              },
              consumer: {
                groupId: 'file.auth',
              },
            },
          },
        ]),
      ],
      providers: [AuthService, AuthGuard],
      exports: [AuthGuard],
      controllers: [AuthController],
    }
  }
}
