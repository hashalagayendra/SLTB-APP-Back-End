import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { PrismaService } from '../prisma.service.js';

@Module({
  exports: [MapsService],
  providers: [MapsService, PrismaService],
  controllers: [MapsController],
})
export class MapsModule {}
