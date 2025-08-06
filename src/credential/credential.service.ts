import { Agent, CredentialExchangeRecord } from '@credo-ts/core';
import { Injectable } from '@nestjs/common';
import { AgentService } from 'src/agent/agent.service';
import { CredentialDto } from './dto/credential.credential.dto';
import { CredentialExDto } from './dto/credential.credentialEx.dto';

@Injectable()
export class CredentialService {
    constructor(private readonly agentService: AgentService) {}

    getHello(): string {
        console.log("Credential Service")
        return 'Hello World!';
    }    

    async getCredentialExs(credentialExDto: CredentialExDto): Promise<CredentialExchangeRecord[]> {
        console.log("*** Connection Service: getConnections");
        const agent: Agent = await this.agentService.getAgentByName(credentialExDto.agentName);
        console.log("Agent name=", credentialExDto.agentName)

        const creds = await agent.credentials.getAll();

        return creds;
    }

    async getCredential(credentialDto: CredentialDto): Promise<any> {
        console.log("*** Connection Service: getConnections");
        const agent: Agent = await this.agentService.getAgentByName(credentialDto.agentName);
        console.log("Agent name=", credentialDto.agentName)

        return (await agent.credentials.getById(credentialDto.credExId)).credentialAttributes;
    }

    async getMostRecentCredential(credentialExDto: CredentialExDto): Promise<any> {
        console.log("*** Connection Service: getMostRecentCredential");
        const agent: Agent = await this.agentService.getAgentByName(credentialExDto.agentName);
        console.log("Agent name=", credentialExDto.agentName)

        const creds = await agent.credentials.getAll();

        // Find most recent credential with the state of done
        let mostRecentId = "";
        let mostRecentDate = new Date("January 1, 2025");
        creds.forEach((item, index) => {
            if(item.state==='done') {
                if(item.createdAt > mostRecentDate) {
                    mostRecentId = item.id;
                    mostRecentDate = item.createdAt;
                }
            }
        })

        // If a credential was found then get the attributes
        let attributes = [];
        if(mostRecentId!=="") {
            attributes = (await agent.credentials.getById(mostRecentId)).credentialAttributes
        }

        return attributes;
    }

}
