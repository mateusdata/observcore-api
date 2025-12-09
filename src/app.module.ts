import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthGuard } from './common/guards/auth/auth.guard';
import { PrismaModule } from './common/prisma/prisma.module';
import { PrometheusConfigsModule } from './modules/prometheus-configs/prometheus-configs.module';
import { ServicesModule } from './modules/services/services.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { AlertsModule } from './modules/alerts/alerts.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 6000, limit: 20, }] }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PrometheusConfigsModule,
    ServicesModule,
    MetricsModule,
    AlertsModule],
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
export class AppModule { }
