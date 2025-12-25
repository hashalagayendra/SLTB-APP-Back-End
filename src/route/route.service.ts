import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Route, Prisma } from '../generated/prisma/client.js';
@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  async getRoutes() {
    const routes = await this.prisma.route.findMany();
    console.log(routes);
    return routes;
  }
}
