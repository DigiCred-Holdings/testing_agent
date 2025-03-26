import { Controller, Get } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) {}

    @Get('/init')
    agentInit(): Promise<string> {
        console.log('Agent Controller called: agentInit');
        return this.agentService.agentInit();
    }
}
