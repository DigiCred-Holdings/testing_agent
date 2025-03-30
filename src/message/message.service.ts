import { Agent, BasicMessageRecord } from '@credo-ts/core';
import { Injectable } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { MessageSendDto } from './dto/message.send.dto';

@Injectable()
export class MessageService {
    constructor(private readonly agentService: AgentService) {}

    async sendMessage(messageSendDto: MessageSendDto): Promise<BasicMessageRecord> {
        console.log("*** Connection Service: receiveInvitation");
        const agent: Agent = await this.agentService.getAgentByName(messageSendDto.agentName);
        console.log("Agent name=", messageSendDto.agentName)

        if (!agent) {
            console.log('Error: Agent is not initialized.');
        }
        try {
            console.log('Sending message to connection ID', messageSendDto.connectionID, " :", messageSendDto.messageBody);
            const connectionRecord =await agent.connections.getById(messageSendDto.connectionID);
            const messageRecord = await agent.basicMessages.sendMessage(connectionRecord.id, messageSendDto.messageBody);
            return messageRecord;
        } catch (error) {
            console.log("Error: Failed to send message ", error);
        }
    }
}
