import { Body, Controller, Get, Post } from '@nestjs/common';
import { RouteService } from './route.service';
import { start } from 'repl';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Get('allRoutes')
  async getAllRoutes() {
    this.routeService.getRoutes();
    console.log('first');
    return 'dddd';
  }

  @Post('getAllRoutesThathroughStartAndEndCity')
  async getAllRoutesThathroughStartAndEndCity(
    @Body('start') start: string,
    @Body('end') end: string,
  ) {
    return this.routeService.getAllRoute(start, end);
  }

  @Post('getTripBelongToRoute')
  async getTripBelongToRoute(@Body('routeId') routeId: string[]) {
    return this.routeService.getTripByRouteId(routeId);
  }

  @Post('getTripDetailsByTripId')
  async getTripDetailsByTripId(@Body('tripId') tripId: number) {
    console.log('incontralle ', tripId);
    return this.routeService.TripDetails(tripId);
  }

  @Post('getCityListByRouteIds')
  async getCityListByRouteIds(@Body('routeIds') routeIds: string[]) {
    console.log('incontralle ', routeIds);
    return this.routeService.getCityListUsingRouteId(routeIds);
  }
}
