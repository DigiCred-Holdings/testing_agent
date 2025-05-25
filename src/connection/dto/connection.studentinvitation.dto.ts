import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectionStudentInvitationDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;
  @IsString()
  @ApiProperty({
    description: 'Invitation url',
    example: "From create invite",
  })
  invitation_url: string;
}