import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModel } from './config.model';
import { readFileSync } from 'fs';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    const data: ConfigModel = JSON.parse(
      readFileSync('config.json', { encoding: 'utf-8' }),
    );
    return {
      global: true,
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
      imports: [MongooseModule.forRoot(data.mongo.connection)],
    };
  }
}
