import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgentWalletDeleteDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;
}