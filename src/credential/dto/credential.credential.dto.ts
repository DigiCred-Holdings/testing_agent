import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialDto {
  @IsString()
  @ApiProperty({
    description: 'Agent name',
    example: "Test",
  })
  agentName: string;

  @IsString()
  @ApiProperty({
    description: 'CredExID',
    example: "8cdb48fa-2ee9-40f6-9415-8f5f76d5c5a3",
  })
  credExId: string;  
}