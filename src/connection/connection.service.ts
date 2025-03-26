import { Injectable } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { agent } from 'supertest';

@Injectable()
export class ConnectionService {
    constructor(private agentService: AgentService){}

    getHello(): string {
        console.log("Connection Service")
        return 'Hello World!';
    }    
}
