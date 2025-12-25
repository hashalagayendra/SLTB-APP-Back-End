import { start } from 'repl';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Route, Prisma } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
import { MapsService } from '../maps/maps.service.js';
@Injectable()
export class RouteService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mapsService: MapsService,
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

  async TripDetails(tripId: number) {
    console.log(tripId);

    const trip = await this.prisma.trip.findUnique({
      where: {
        tripId,
      },
      include: { TripTimeWithCity: true },
    });

    // Sort TripTimeWithCity for each trip by total time (days, hours, mins)
    const sortedTrip = trip
      ? {
          ...trip,
          TripTimeWithCity: trip.TripTimeWithCity
            ? [...trip.TripTimeWithCity].sort((a, b) => {
                const aTotal =
                  (a.days ?? 0) * 24 * 60 + (a.hours ?? 0) * 60 + (a.mins ?? 0);
                const bTotal =
                  (b.days ?? 0) * 24 * 60 + (b.hours ?? 0) * 60 + (b.mins ?? 0);
                return aTotal - bTotal;
              })
            : [],
        }
      : null;

    console.log(`trips are ${JSON.stringify(sortedTrip)}`);

    //Add cordination into TripTimeWithCity array
    const addCordinationsIntoTrip =
      await this.mapsService.addGeocodsIntoTripTimeDetails(sortedTrip);

    console.log('cordinated sorted list', addCordinationsIntoTrip);
    //get nearest bounds
    const time = new Date();
    const hours = time.getHours();
    const mins = time.getMinutes();

    const nearestBoundsWithFinalData = await this.mapsService.findNearestBounds(
      {
        hours,
        mins,
        tripData: await addCordinationsIntoTrip,
      },
    );

    return nearestBoundsWithFinalData;
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
