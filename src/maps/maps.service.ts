import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PositionAndTime {
  latitude: number;
  longitude: number;
  time: { hour: number; minute: number };
  cityName: string;
}

interface TripDetails {
  positionAndTime: PositionAndTime[];
  start: {
    cityName: string;
    latitude: number;
    longitude: number;
    time: { hour: number; minute: number };
  };
  end: {
    cityName: string;
    latitude: number;
    longitude: number;
    time: { hour: number; minute: number };
  };
}

@Injectable()
export class MapsService {
  constructor(
    private configService: ConfigService,
    // private apiKey: string | undefined = configService.get<string>(
    //   'GOOGLE_MAPS_KEY',
    // ),
    // private busRote = [
    //   {
    //     positionAndTime: [
    //       {
    //         latitude: 7.271163330690157,
    //         longitude: 80.60777527380574, // gatabe
    //         time: { hour: 5, minute: 30 },
    //         cityName: 'gatabe',
    //       },
    //       {
    //         latitude: 7.265245739547621,
    //         longitude: 80.54506299370561, // Pilimathalawa
    //         time: { hour: 6, minute: 0 },
    //         cityName: 'Pilimathalawa',
    //       },

    //       {
    //         latitude: 7.011112,
    //         longitude: 80.262852,
    //         time: { hour: 8, minute: 0 },
    //         cityName: 'Mawanella',
    //       }, // Mawanella
    //       {
    //         latitude: 6.958462565701763,
    //         longitude: 80.214786512875017, // awissawella
    //         time: { hour: 9, minute: 0 },
    //         cityName: 'awissawella',
    //       },
    //     ],
    //     start: {
    //       cityName: 'kandy',
    //       latitude: 7.292473427823725,
    //       longitude: 80.63122957801451,
    //       time: { hour: 5, minute: 0 },
    //     },
    //     end: {
    //       cityName: 'Rathnapura',
    //       latitude: 6.722659835209608,
    //       longitude: 80.3833579778542,
    //       time: { hour: 10, minute: 0 },
    //     },

    //     citys: {
    //       Kandy: 1,
    //       Pilimathalawa: 2,
    //       Mawanella: 3,
    //       Kegalla: 4,
    //       Ruwanwella: 5,
    //       Anguruwella: 6,
    //       Awissawella: 7,
    //       Rathnapura: 8,
    //     },
    //   },
    // ],
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_KEY');
  }
  private readonly apiKey: string | undefined;
  //   async getRouteCoordinates(origin: string, destination: string) {
  //     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${process.env.GOOGLE_MAPS_KEY}`;

  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (!data.routes?.length) {
  //       throw new Error('No route found');
  //     }

  //     const encoded = data.routes[0].overview_polyline.points;

  //     const coordinates = polyline.decode(encoded).map(([lat, lng]) => ({
  //       latitude: lat,
  //       longitude: lng,
  //     }));

  //     return coordinates;
  //   }

  async timeToSeconds(time: { hour: number; minute: number }) {
    return time.hour * 3600 + time.minute * 60;
  }

  async getRouteDetails(tripId: string = 'bus-001'): Promise<TripDetails> {
    const tripDetails: TripDetails = {
      positionAndTime: [
        {
          latitude: 7.271163330690157,
          longitude: 80.60777527380574, // gatabe
          time: { hour: 5, minute: 30 },
          cityName: 'gatabe',
        },
        {
          latitude: 7.265245739547621,
          longitude: 80.54506299370561, // Pilimathalawa
          time: { hour: 6, minute: 0 },
          cityName: 'Pilimathalawa',
        },

        {
          latitude: 7.011112,
          longitude: 80.262852,
          time: { hour: 8, minute: 0 },
          cityName: 'Mawanella',
        }, // Mawanella
        {
          latitude: 6.958462565701763,
          longitude: 80.214786512875017, // awissawella
          time: { hour: 9, minute: 0 },
          cityName: 'awissawella',
        },
      ],
      start: {
        cityName: 'kandy',
        latitude: 7.292473427823725,
        longitude: 80.63122957801451,
        time: { hour: 5, minute: 0 },
      },
      end: {
        cityName: 'Rathnapura',
        latitude: 6.722659835209608,
        longitude: 80.3833579778542,
        time: { hour: 10, minute: 0 },
      },
    };

    return tripDetails;
  }

  async findNearestBounds(currentTimeAndPositionAndTime: {
    hour: number;
    minute: number;
    tripId: string;
  }) {
    const secondsOfCurrentTime = await this.timeToSeconds(
      currentTimeAndPositionAndTime,
    );
    let minPastDiff = Number.POSITIVE_INFINITY;
    let minFutureDiff = Number.POSITIVE_INFINITY;
    let pastPosition: PositionAndTime | null = null;
    let futurePosition: PositionAndTime | null = null;

    const tripDetails = await this.getRouteDetails();

    for (const eachPosition of tripDetails.positionAndTime) {
      const secondsEachPosition = await this.timeToSeconds(eachPosition.time);
      let diff = secondsOfCurrentTime - secondsEachPosition;
      let futureDiff = secondsEachPosition - secondsOfCurrentTime;

      // Past (lower bound)
      if (diff >= 0 && diff < minPastDiff) {
        minPastDiff = diff;
        pastPosition = eachPosition;
      }
      // Future (upper bound)
      if (futureDiff >= 0 && futureDiff < minFutureDiff) {
        minFutureDiff = futureDiff;
        futurePosition = eachPosition;
      }
    }

    return { pastPosition, futurePosition };
  }

  async presentageBetweenPoints(
    nearestPastPoint: any,
    nearestFuturePoint: any,
    userTime: any,
  ) {
    const userTimeInSeconds = await this.timeToSeconds(userTime);
    const pastTimeInSeconds = await this.timeToSeconds(nearestPastPoint?.time);
    console.log(nearestPastPoint?.time);
    const futureTimeInSeconds = await this.timeToSeconds(
      nearestFuturePoint?.time,
    );
    const presentage =
      (userTimeInSeconds - pastTimeInSeconds) /
      (futureTimeInSeconds - pastTimeInSeconds);
    return presentage;
  }

  async testApi() {
    // const apiKey = this.configService.get<string>('GOOGLE_MAPS_KEY');
    return 'MapsService is working! API Key: ' + this.apiKey;
  }

  //  City → coordinates
  async geocodeCity(city: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      city,
    )}&key=${this.apiKey}`;

    const res = await fetch(url);
    const data = await res.json();
    // console.log(res);

    if (!data.results?.length) {
      throw new Error(`City not found: ${city}`);
    }

    console.log(
      `${city} cordinates are ${JSON.stringify(data.results[0].geometry.location)}`,
    );
    return data.results[0].geometry.location; // { lat, lng }
  }
}
