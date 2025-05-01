import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgentInitDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;
  @IsInt()
  @ApiProperty({
    description: 'Port Number',
    example: 5000,
  })
  port: number;
}