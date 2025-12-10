import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth/auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EmailsModule } from './modules/emails/emails.module';
import { ConfigModule } from '@nestjs/config';
import { PrometheusConfigsModule } from './modules/prometheus-configs/prometheus-configs.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { ServicesModule } from './modules/services/services.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
    UsersModule,
    PrismaModule,
    AuthModule,
    EmailsModule,
    PrometheusConfigsModule,
    ServicesModule,
    MetricsModule,
    AlertsModule,

  ],

  providers: [

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');

  }
}