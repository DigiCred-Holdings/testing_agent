import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService],
  imports: [AgentModule]
})
export class ConnectionModule {}
