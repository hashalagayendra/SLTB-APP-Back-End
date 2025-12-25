import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouteModule } from './route/route.module';
import { PrismaService } from './prisma.service.js';
import { MapsModule } from './maps/maps.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RouteModule,
    MapsModule,
    ConfigModule.forRoot({
      isGlobal: true, // optional: makes config available everywhere without importing again
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
