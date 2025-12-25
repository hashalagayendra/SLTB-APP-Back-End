import { start } from 'repl';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Route, Prisma } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RouteService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getRoutes() {
    const routes = await this.prisma.route.findMany();
    console.log(routes);
    const api = this.configService.get<string>('GOOGLE_MAPS_KEY');
    console.log('API URL:', api);

    return routes;
  }

  // get all route that parse through start and end city
  async getAllRoute(start: string, end: string) {
    const route = await this.prisma.city.findMany({
      where: {
        name: {
          in: [start, end],
        },
      },
      include: {
        Route: {
          select: {
            routeId: true,
            name: true,
          },
        },
      },
    });
    console.log(
      `Routes Lists that include both the cities '${start}' and '${end}':`,
      route,
    );
    const routeIds = route
      .map((city) => city.Route.map((r) => r.routeId))
      .flat();

    const uniqueRouteIds = Array.from(new Set(routeIds));
    console.log('Route IDs:', uniqueRouteIds);

    // get routes that connect both cities
    const routesConnectBothCities = await this.prisma.route.findMany({
      where: {
        routeId: { in: uniqueRouteIds },
        AND: [
          {
            City: {
              some: {
                name: start,
              },
            },
          },
          {
            City: {
              some: {
                name: end,
              },
            },
          },
        ],
      },
    });

    return routesConnectBothCities;
  }

  async getTripByRouteId(routeId: string) {
    const trips = await this.prisma.trip.findMany({
      where: {
        routeId: routeId,
      },
    });
    console.log(`Trips for Route ID ${routeId}:`, trips);
    return trips;
  }

  async TripDetails(tripId: number[]) {
    console.log(tripId);

    const trips = await this.prisma.trip.findMany({
      where: {
        tripId: { in: tripId },
      },
      include: { TripTimeWithCity: true },
    });

    console.log(`trips are ${trips}`);

    return trips;
  }

  //   async getCityListForEachRouter(Route: Route[]) {

  //     for (const route of Route) {
  //       const cities = await this.prisma.route.findMany({
  //         where: {
  //             id: route.id,
  //         },
  //       });
  //       console.log(`Cities for Route ID ${route.id}:`, cities);
  //     }

  //   }
}
