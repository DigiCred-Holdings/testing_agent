import { Module } from '@nestjs/common';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  controllers: [CredentialController],
  providers: [CredentialService],
  imports: [AgentModule]
})
export class CredentialModule {}
