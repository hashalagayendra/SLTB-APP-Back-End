import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { PrismaService } from '../prisma.service.js';
import { MapsModule } from '../maps/maps.module.js';

@Module({
  imports: [MapsModule],
  providers: [RouteService, PrismaService],
  controllers: [RouteController],
})
export class RouteModule {}
