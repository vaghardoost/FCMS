import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModel } from './config.model';
import { readFileSync, existsSync, mkdirSync } from 'fs';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    const config: ConfigModel = JSON.parse(
      readFileSync('config.json', { encoding: 'utf-8' }),
    );
    const paths = [ 
      config.video.path,
      config.audio.path,
      config.photo.path,
      config.doc.path
    ];
    for (const path of paths) {
      if (!existsSync(path)) {
        mkdirSync(path,{ recursive: true });
      }
    }
    return {
      global: true,
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
      imports: [MongooseModule.forRoot(config.mongo.connection)],
    };
  }
}
