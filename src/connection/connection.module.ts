import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { AgentService } from 'src/agent/agent.service';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService, AgentService]
})
export class ConnectionModule {}
