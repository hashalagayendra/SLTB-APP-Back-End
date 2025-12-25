import { Controller, Body, Query, Get, Post, Request } from '@nestjs/common';
import { MapsService } from './maps.service.js';

interface Position {
  latitude: number;
  longitude: number;
  time: {
    hour: number;
    minute: number;
  };
  cityName: string;
}

interface CoordinatesResponse {
  coordinates: {
    pastPosition: Position | null;
    futurePosition: Position | null;
  };
}

@Controller('maps')
export class MapsController {
  constructor(private readonly MapsService: MapsService) {}
  @Get('test')
  async getRoute(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    return {
      coordinates: await this.MapsService.testApi(),
    };
  }

  @Post('getBusPositionInNearestTwoPoints')
  async getBusPositionInNearestTwoPoints(
    @Body('hour') hour: number,
    @Body('minute') minute: number,
    @Body('tripId') tripId: string,
  ): Promise<CoordinatesResponse> {
    const coordinates = await this.MapsService.findNearestBounds({
      hour,
      minute,
      tripId,
    });
    return {
      coordinates,
    };
  }

  @Post('getPercentageOfBusPositionBetweenTwoNearestPoints')
  async getPercentage(
    @Request() req,
    @Body('nearestPastPoint') nearestPastPoint: any,
    @Body('nearestFuturePoint') nearestFuturePoint: any,
    @Body('userTime') userTime: { hour: number; minute: number },
  ) {
    console.log('data is ', nearestFuturePoint);
    const presentage = await this.MapsService.presentageBetweenPoints(
      nearestPastPoint,
      nearestFuturePoint,
      userTime,
    );
    return presentage;
  }

  @Post('getRouteCoordinatesUsingCityName')
  async getRouteCoordinatesUsingCityName(@Body('city') city: string) {
    console.log('data is ', city);
    const res = await this.MapsService.geocodeCity(city);
    return res;
  }
}
