import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  public static register():DynamicModule{
    return {
      module:ConfigModule,
      global:true,
      exports:[ConfigService],
      providers:[ConfigService],
    }
  }
}
