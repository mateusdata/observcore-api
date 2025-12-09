import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthGuard } from './common/guards/auth/auth.guard';
import { PrismaModule } from './common/prisma/prisma.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 6000, limit: 20, }] }),
    PrismaModule,
    UsersModule,
    AuthModule],
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
