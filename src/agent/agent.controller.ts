import { Controller, Get, Body, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentInitDto } from './dto/agent.init.dto'
import { AgentWalletDeleteDto } from './dto/agent.walletdelete.dto';

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) {}

    @Post('/init')
    agentInit(@Body() agentInitDto: AgentInitDto): Promise<string> {
        console.log('Agent Controller called: agentInit');
        return this.agentService.agentInit(agentInitDto);
    }

    @Post('/delete')
    walletDelete(@Body() agentWalletDeleteDto: AgentWalletDeleteDto): Promise<string> {
        console.log('Agent Controller called: walletDelete');
        return this.agentService.walletDelete(agentWalletDeleteDto);
    }

}
