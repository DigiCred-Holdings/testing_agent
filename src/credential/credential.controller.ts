import { Body, Controller, Get, Post } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialExchangeRecord } from '@credo-ts/core';
import { CredentialDto } from './dto/credential.credential.dto';
import { CredentialExDto } from './dto/credential.credentialEx.dto';

@Controller('credential')
export class CredentialController {
constructor(private readonly credentialService: CredentialService) {}

    @Get()
    getHello(): string {
      console.log('Connection Controller called');
      return this.credentialService.getHello();
    }

    @Post('credex')
    getCredentialsEx(@Body() credentialExDto: CredentialExDto): Promise<CredentialExchangeRecord[]> {
      console.log('getCredentialsEx called');
      return this.credentialService.getCredentialExs(credentialExDto);
    }

    @Post('cred')
    getCredential(@Body() credentialDto: CredentialDto): Promise<CredentialExchangeRecord> {
      console.log('getCredentials called');
      return this.credentialService.getCredential(credentialDto);
    }

    @Post('recent')
    getMostRecentCredential(@Body() credentialExDto: CredentialExDto): Promise<any> {
      console.log('getMostRecentCredential called');
      return this.credentialService.getMostRecentCredential(credentialExDto);
    }

    

}
