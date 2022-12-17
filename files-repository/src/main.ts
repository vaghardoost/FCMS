import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const configService = app.get(ConfigService)
  await app.listen(configService.config.port);
}
console.log('look like i will update that');

bootstrap();
