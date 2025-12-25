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

  @Post('getAllRouteIdsUsingStartAndEndCity')
  async getAllRouteIdsUsingStartAndEndCity(
    @Body('start') start: string,
    @Body('end') end: string,
  ) {
    return this.routeService.getAllRouteIds(start, end);
  }
}
