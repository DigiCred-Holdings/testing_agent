import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Controller('connection')
export class ConnectionController {
    constructor(private readonly connectionService: ConnectionService) {}

    @Get()
    getHello(): string {
      console.log('Connection Controller called');
      return this.connectionService.getHello();
    }

}
