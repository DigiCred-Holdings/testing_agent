import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './connection/connection.module';
import { MessageModule } from './message/message.module';
import { CredentialModule } from './credential/credential.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [ConnectionModule, MessageModule, CredentialModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
