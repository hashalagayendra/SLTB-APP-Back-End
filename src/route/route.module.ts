import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [RouteService, PrismaService],
  controllers: [RouteController],
})
export class RouteModule {}
