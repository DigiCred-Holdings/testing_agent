import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionRecord, OutOfBandRecord } from '@credo-ts/core';
import { ConnectionReceiveInvitationDto } from './dto/connection.receiveinvitation.dto'
import { ConnectionGetConnectionsDto } from './dto/connection.getconnections.dto';
import { ConnectionStudentInvitationDto } from './dto/connection.studentinvitation.dto';

@Controller('connection')
export class ConnectionController {
    constructor(private readonly connectionService: ConnectionService) {}

    @Get()
    getHello(): string {
      console.log('Connection Controller called');
      return this.connectionService.getHello();
    }

    @Post('/connections')
    async getConnections(@Body() connectionGetConnectionsDto: ConnectionGetConnectionsDto): Promise<ConnectionRecord[]> {
        return await this.connectionService.getConnections(connectionGetConnectionsDto);
    }


    @Post('/invite')
    async receiveInvitation(@Body() connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<OutOfBandRecord> {
        return await this.connectionService.receiveInvitation(connectionReceiveInvitationDto);
    }

    @Post('/studentinvite')
    async studentInvitation(@Body() connectionReceiveInvitationDto: ConnectionStudentInvitationDto): Promise<OutOfBandRecord> {
        return await this.connectionService.receiveStudentInvitation(connectionReceiveInvitationDto);
    }

    @Post('/createinvite')
    async createInvitation(@Body() connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<any> {
        return await this.connectionService.createInvitation(connectionReceiveInvitationDto);
    }

}
