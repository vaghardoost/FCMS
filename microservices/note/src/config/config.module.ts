import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { readFileSync } from 'fs';
import { ConfigModel } from './config.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [ConfigService],
})
export class ConfigModule {
  static register() {
    const data: string = readFileSync('config.json', { encoding: 'utf-8' });
    const config: ConfigModel = JSON.parse(data);
    return {
      module: ConfigModule,
      global: true,
      exports: [ConfigService],
      providers: [ConfigService],
      imports: [MongooseModule.forRoot(config.mongo.connection)],
    };
  }
}
