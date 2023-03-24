import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose"
import NamespaceModule from './namespace/namespace.module';

@Module({
  imports: [
    NamespaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (service: ConfigService) => ({
        uri: service.get('MONGO')
      })
    })
  ],
})
export class AppModule { }
