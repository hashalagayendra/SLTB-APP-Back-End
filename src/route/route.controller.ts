import { Controller, Get } from '@nestjs/common';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Get('allRoutes')
  async getAllRoutes() {
    this.routeService.getRoutes();
    console.log('first');
    return 'dddd';
  }
}
