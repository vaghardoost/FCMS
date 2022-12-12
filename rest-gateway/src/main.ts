import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './module/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const configService = app.get(ConfigService)
  await app.listen(configService.config.port);
}
bootstrap();
