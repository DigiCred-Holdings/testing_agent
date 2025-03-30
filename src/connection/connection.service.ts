import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { Agent, ConnectionEventTypes, ConnectionRecord, ConnectionStateChangedEvent, DidExchangeState, OutOfBandRecord } from '@credo-ts/core'
import { ConnectionReceiveInvitationDto } from './dto/connection.receiveinvitation.dto'

@Injectable()
export class ConnectionService {
    constructor(private readonly agentService: AgentService) {}

    getHello(): string {
        console.log("Connection Service")
        return 'Hello World!';
    }    

    async getConnections(connectionReceiveInvitationDto: ConnectionReceiveInvitationDto): Promise<ConnectionRecord[]> {
        console.log("*** Connection Service: receiveInvitation");
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

    async setupConnectionListener(agentName: string, outOfBandRecord: OutOfBandRecord ) {
        console.log("*** Connection Service: setupConnectionListener");
        const agent: Agent = await this.agentService.getAgentByName(agentName);
        console.log("Agent name=", agentName)
        agent.events.on<ConnectionStateChangedEvent>(
            ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
                console.log('~~ ConnectionStateChange=', payload);
                if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) 
                    return;
                if (payload.connectionRecord.state === DidExchangeState.Completed) {
                    // the connection is now ready for usage in other protocols!
                    console.log('Connection for out-of-band id ${outOfBandRecord.id} completed.');

                }
            }
        );
    }

}