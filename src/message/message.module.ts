import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [AgentModule]
})
export class MessageModule {}
