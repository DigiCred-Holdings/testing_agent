import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectionReceiveInvitationDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;
}