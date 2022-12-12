import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModel } from './config.model';
import { readFileSync } from 'fs';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    const data = readFileSync('config.json', {
      encoding: 'utf-8',
    });
    const config: ConfigModel = JSON.parse(data);
    const { connection } = config.mongodb;
    return {
      global: true,
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
      imports: [MongooseModule.forRoot(connection)],
    };
  }
}
