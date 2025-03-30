import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageSendDto {
  @IsString()
  @ApiProperty({
    description: 'ConnectionID',
    example: "get the ID from the Connections call",
  })
  connectionID: string;

  @IsString()
  @ApiProperty({
    description: 'Message to send',
    example: ":menu",
  })
  messageBody: string;

  @IsString()
  @ApiProperty({
    description: 'Agent Name',
    example: "Test",
  })
  agentName: string;

}