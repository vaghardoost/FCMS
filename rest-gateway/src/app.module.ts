import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { LogMiddleware } from './middleware/log.middleware';
import { ConfigModule } from './module/config/config.module';
import { MicroserviceModule } from "./microservice/base.module";
import { AuthModule } from "./module/auth/auth.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { APP_GUARD } from "@nestjs/core"
import { AuthRoleGuard } from "./module/auth/guard/auth.role.guard";

@Module({
  providers:[
    {
      provide:APP_GUARD,
      useClass:AuthRoleGuard
    }
  ],
  imports: [
    ConfigModule.register(),
    MicroserviceModule.register(),
    AuthModule.register(),
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({path:"*",method:RequestMethod.ALL});
    consumer.apply(AuthMiddleware).forRoutes({path:"*",method:RequestMethod.ALL});
  }
}
