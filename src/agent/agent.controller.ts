import { Controller, Body, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentInitDto } from './dto/agent.init.dto';
import { AgentWalletDeleteDto } from './dto/agent.walletdelete.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('/init')
  async agentInit(@Body() agentInitDto: AgentInitDto): Promise<{ message: string }> {
    console.log('Agent Controller called: agentInit');
    const result = await this.agentService.agentInit(agentInitDto);
    return { message: result }; // ✅ wrap the string in an object
  }

  @Post('/delete')
  async walletDelete(@Body() agentWalletDeleteDto: AgentWalletDeleteDto): Promise<{ message: string }> {
    console.log('Agent Controller called: walletDelete');
    const result = await this.agentService.walletDelete(agentWalletDeleteDto);
    return { message: result }; // ✅ wrap for consistency
  }
}
