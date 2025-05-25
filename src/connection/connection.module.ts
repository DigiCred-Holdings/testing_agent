import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { AgentModule } from 'src/agent/agent.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService],
  imports: [AgentModule,HttpModule]
})
export class ConnectionModule {}
