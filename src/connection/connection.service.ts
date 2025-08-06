import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { Agent, ConnectionEventTypes, ConnectionRecord, ConnectionStateChangedEvent, DidExchangeState, OutOfBandRecord } from '@credo-ts/core'
import { ConnectionReceiveInvitationDto } from './dto/connection.receiveinvitation.dto'
import { ConnectionStudentInvitationDto } from './dto/connection.studentinvitation.dto';

@Injectable()
export class ConnectionService {
    constructor(private readonly agentService: AgentService, private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    getHello(): string {
        console.log("Connection Service")
        return 'Hello World!';
    }    

    async getConnections(connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<ConnectionRecord[]> {
        console.log("*** Connection Service: getConnections");
        const agent: Agent = await this.agentService.getAgentByName(connectionReceiveInvitationDto.agentName);
        console.log("Agent name=", connectionReceiveInvitationDto.agentName)

        return agent.connections.getAll();

    }

    async receiveInvitation(connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<OutOfBandRecord> {
        console.log("*** Connection Service: receiveInvitation");
        const agent: Agent = await this.agentService.getAgentByName(connectionReceiveInvitationDto.agentName);
        console.log("Agent name=", connectionReceiveInvitationDto.agentName)
        const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(process.env.MULTIUSE_INVITATION);

        await this.setupConnectionListener(connectionReceiveInvitationDto.agentName, outOfBandRecord);
        return outOfBandRecord
    } 

    async receiveStudentInvitation(connectionReceiveInvitationDto: ConnectionStudentInvitationDto): Promise<OutOfBandRecord> {
        console.log("*** Connection Service: receiveStudentInvitation");
        const agent: Agent = await this.agentService.getAgentByName(connectionReceiveInvitationDto.agentName);
        console.log("Agent name=", connectionReceiveInvitationDto.agentName)
        const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(connectionReceiveInvitationDto.invitation_url);

        await this.setupConnectionListener(connectionReceiveInvitationDto.agentName, outOfBandRecord);
        return outOfBandRecord
    } 

    async studentInvitation(connectionStudentInvitationDto: ConnectionStudentInvitationDto): Promise<OutOfBandRecord> {
        console.log("*** Connection Service: studentInvitation");
        const agent: Agent = await this.agentService.getAgentByName(connectionStudentInvitationDto.agentName);
        console.log("Agent name=", connectionStudentInvitationDto.agentName)
        const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(connectionStudentInvitationDto.invitation_url);

        await this.setupConnectionListener(connectionStudentInvitationDto.agentName, outOfBandRecord);
        return outOfBandRecord
    } 

    async setupConnectionListener(agentName: string, outOfBandRecord: OutOfBandRecord ) {
        console.log("*** Connection Service: setupConnectionListener");
        const agent: Agent = await this.agentService.getAgentByName(agentName);
        console.log("Agent name=", agentName)
        agent.events.on<ConnectionStateChangedEvent>(
            ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
                console.log('=== ConnectionStateChange=', payload);
                if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) 
                    return;
                if (payload.connectionRecord.state === DidExchangeState.Completed) {
                    // the connection is now ready for usage in other protocols!
                    console.log('Connection for out-of-band id ${outOfBandRecord.id} completed.');

                }
            }
        );
    }

    private getRequestConfig(): AxiosRequestConfig {
        return {
            headers: {
                Authorization: `Bearer ${this.configService.get<string>('BEARER_TOKEN')}`,
                'X-API-KEY': this.configService.get<string>('API_KEY'),
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
        };
    }

    async createInvitation(connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<any> {
        console.log("*** Connection Service: createInvitation");
        const verificationRequestUrl = `${this.configService.get<string>('ADMIN_INTERFACE')}/out-of-band/create-invitation?multi_use=false&auto_accept=true`;
        const verificationRequestConfig: AxiosRequestConfig = this.getRequestConfig();

        try {
            const data = {
                "accept": [
                    "didcomm/aip1",
                    "didcomm/aip2;env=rfc19"
                ],
                "alias": "Michael Jordan -studentID- 0023",
                "attachments": [],
                "goal": "",
                "goal_code": "",
                "handshake_protocols": [
                    "https://didcomm.org/didexchange/1.0"
                ],
                "metadata": {
                    "additionalProp1": "0023"
                },
                "my_label": connectionReceiveInvitationDto.agentName,
                "protocol_version": "1.1",
                "use_public_did": false
            }  
            const invitation = await lastValueFrom(
            this.httpService.post(verificationRequestUrl, data, verificationRequestConfig).pipe(map((resp) => resp.data)));
            console.log('Proof request sent successfully');
            //const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(invitation.invitation_url);
    
            //await this.setupConnectionListener(connectionReceiveInvitationDto.agentName, outOfBandRecord);
            return invitation;
        } catch (error) {
            console.log('Error create invitation:', error.message);
            throw new Error('Failed to send proof request');
        }
        return null
    } 

}