import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectionGetConnectionsDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;
}