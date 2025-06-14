import { Injectable } from '@nestjs/common';
import type { InitConfig } from '@credo-ts/core'
import { Agent, ConnectionsModule, MediationRecipientModule, MediatorPickupStrategy, V2CredentialProtocol } from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/node'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { AnonCredsCredentialFormatService, AnonCredsModule, LegacyIndyCredentialFormatService } from '@credo-ts/anoncreds'
import { IndyVdrAnonCredsRegistry, IndyVdrModule } from '@credo-ts/indy-vdr'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { HttpOutboundTransport, WsOutboundTransport } from '@credo-ts/core'
import { HttpInboundTransport } from '@credo-ts/node'
import { AgentInitDto } from './dto/agent.init.dto'
import { ConsoleLogger, LogLevel } from '@credo-ts/core'
import { AgentWalletDeleteDto } from './dto/agent.walletdelete.dto';
//import { AutoAcceptCredential } from '@aries-framework/core'

@Injectable()
export class AgentService {
    public agents: Map<string, Agent> = new Map();
    public agent: Agent;

    async agentInit(agentInitDto: AgentInitDto): Promise<string> {
        const mediatorInvitationUrl:string = process.env.MEDIATOR_INVITATION;
        console.log("*** Agent Service agentInit");
        let init = "Agent " + agentInitDto.agentName + " init success";

        if (this.agents.has(agentInitDto.agentName)) {
            console.log("Agent already initialized");
            return init;
        }

        const config: InitConfig = {
            label: 'docs-agent-nodejs',
            walletConfig: {
              id: 'wallet-id-' + agentInitDto.agentName,
              key: 'DigiCredTesting00000000000000000',
            },
            logger: new ConsoleLogger(LogLevel.info),
           // autoAcceptCredentials: AutoAcceptCredential.ContentApproved
        }        

        try {
            this.agent = new Agent({
                config,
                dependencies: agentDependencies,
                modules: {
                    askar: new AskarModule({
                        ariesAskar,
                    }),
                    connections: new ConnectionsModule({ 
                        autoAcceptConnections: true 
                    }),
                    anoncreds: new AnonCredsModule({
                        registries: [new IndyVdrAnonCredsRegistry()],
                        anoncreds,
                    }),
                    indyVdr: new IndyVdrModule({
                        indyVdr,
                        networks: [
                        {
                            isProduction: true,
                            indyNamespace: 'DigiCred:prod',
                            genesisTransactions: "{\"reqSignature\":{},\"txn\":{\"data\":{\"data\":{\"alias\":\"DigiNode1\",\"blskey\":\"Bgtn4EfevXYUqQxiTwFUh9byoTTtL25WnxB2KBDPbkhHHTf646JLQR1UHRS9Fd9w4dW9tWnPhkDbaNbHXRP7msNCqY3SiufgFnSZcoLDYXD3WihvEdF5jbJMNR4Y5SjFcrUtRSz6cQDkw9AafKJzvjcNB7LWDXCvZArZEfYgH8zwcB\",\"blskey_pop\":\"RPNQLxXBw8PW1dvrAmgT4xZ8o6Qe2r8jMhNstyMKYqfmGAAmW7Cb6tjAjqzGVgWnCx3ehuQ2rWNQD5fehPAQs5nBg91ufA9kMP3EM1eB3NCwrzRkWUoj3s3w3fDQQfhyD6ejVt3a8CC5hzqdhFVWFFBXxh9kiaAdCmYxsaz9xC9RyZ\",\"client_ip\":\"54.183.121.23\",\"client_port\":9702,\"node_ip\":\"54.183.121.23\",\"node_port\":9701,\"services\":[\"VALIDATOR\"]},\"dest\":\"kTUKgEAHLmcszrRAdJwTt9ZBVmYFy7P64N6LBbCLWQM\"},\"metadata\":{\"from\":\"UsYedEydqSRmFW2hXbx45y\"},\"type\":\"0\"},\"txnMetadata\":{\"seqNo\":1,\"txnId\":\"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62\"},\"ver\":\"1\"}\r\n{\"reqSignature\":{},\"txn\":{\"data\":{\"data\":{\"alias\":\"DigiNode2\",\"blskey\":\"2W6uhQyotZN9eTSdw4WWZJph9c3wfvw2hXii4tkjea23DMFMwYaj3iDZQQPYGqfh6EkbeTQZDLWwWhbfRreHGQKTs3iKXe39eoFRS2iPGxmxzWKgSRkedEwk3Cfzz2NdRzFKdA9t9UBgGUnKujGBVTJTvwCPM8GpTNyCvKPbHavNzNw\",\"blskey_pop\":\"QtWQp5A7cdU3QSXejNno4NddrQ1tqazHhZnFsnbEFWPxzr9Vq1G1NY77qRDDC7FPnZzdYD74qh7jePDJkK98avoHXgXeiEWVU9vFwk2TJuMRW41A69ih1BxwH6bA88nLKLEGxYbZZvcvjeMuwX7tF21x2G9rf8C82jrekkQYupp2DV\",\"client_ip\":\"52.53.213.216\",\"client_port\":9704,\"node_ip\":\"52.53.213.216\",\"node_port\":9703,\"services\":[\"VALIDATOR\"]},\"dest\":\"9fX2bsrFgLN7RMxdu6Ak5BgpykJVUBzQHEKeB1PixBTg\"},\"metadata\":{\"from\":\"RJgdSwebLWZCkuBCwCieyN\"},\"type\":\"0\"},\"txnMetadata\":{\"seqNo\":2,\"txnId\":\"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc\"},\"ver\":\"1\"}\r\n{\"reqSignature\":{},\"txn\":{\"data\":{\"data\":{\"alias\":\"DigiNode3\",\"blskey\":\"4f2Q5hxgAnvxjUq7UULtkwyX9yN89Uq24HLDKruhReqmdDLrNieXXT2qyFwbtBtzeGw1241zrAFH4P8yQ4BjV1w1xPLwWxi7npCh55goSmN9HNekuYkkfX3B6AsoTu4u2GHFzGC4UE9H3DVYo3Ud9v17ZoPmw2AmMpJouNo9WjghWZT\",\"blskey_pop\":\"R6kk8V44iUgT4DdqUtmTzYx638fFpJRrkgqjt1m5227Vr3fT3aBj17tb4MjcvLxBf5GYbS2f9bov6QBNuXa3LV5pJVRpu94Rf4eYjufwLAnyZhgjbJ3mBCrHbnEgyyUbkPogtLM4TJftbFsWHW85KHDdcbV45fZTLsSyz2Kv6dSjxT\",\"client_ip\":\"52.53.197.98\",\"client_port\":9706,\"node_ip\":\"52.53.197.98\",\"node_port\":9705,\"services\":[\"VALIDATOR\"]},\"dest\":\"7dqLgQKzoVUJvocyBr19XA6J6kMXYUQFodo4g8TaWc1T\"},\"metadata\":{\"from\":\"HjaTenuV8qMxMBxdr1TXFb\"},\"type\":\"0\"},\"txnMetadata\":{\"seqNo\":3,\"txnId\":\"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4\"},\"ver\":\"1\"}\r\n{\"reqSignature\":{},\"txn\":{\"data\":{\"data\":{\"alias\":\"DigiNode4\",\"blskey\":\"3AuzHrkJ6rBzqcjQVdE521gC78fv8N1qLmZoxGWo3uh6eVx5rkEpcPao2tK2Grh37EQHqgumTsMwEyX3DfBDMbYASiZnRfgx9paF4dm26tQyPiSN5sSxgsm9Ay5SoJmQzNaDAPa8YnmrVPBCvcPDNy8HX8c68Z3b7mBkT7bYkpw58vf\",\"blskey_pop\":\"QrUhbAv1VTLLXBR5ehTBZN4ZwXgPzPyj6EfLGDqHhyv9h8SFEV7PMZLeftJNDqhuzQCeCP3NPTCDr4UWhrc9m8sBPqPwscHxcyDXmZhXAiayLA5zzZDkHzoUhUYCUqDpxngRpLBhrKd8izJSZkMN1VXVfRqNdYgdgCnNw2NqECRGyd\",\"client_ip\":\"50.18.0.176\",\"client_port\":9708,\"node_ip\":\"50.18.0.176\",\"node_port\":9707,\"services\":[\"VALIDATOR\"]},\"dest\":\"5YqYbviZb8Ju6DJACSegPZNfgspEFJpwCqYx9Prqb29z\"},\"metadata\":{\"from\":\"CyTFyjqPJsporuJ7zFAbFu\"},\"type\":\"0\"},\"txnMetadata\":{\"seqNo\":4,\"txnId\":\"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008\"},\"ver\":\"1\"}",
                            connectOnStartup: true,
                        },
                        ],
                    }),
                    mediationRecipient: new MediationRecipientModule({
                        mediatorInvitationUrl
                    }),
                }
            })

            this.agent.registerOutboundTransport(new HttpOutboundTransport())
            this.agent.registerOutboundTransport(new WsOutboundTransport())
            this.agent.registerInboundTransport(new HttpInboundTransport({ port: agentInitDto.port }))

            // Initialize the agent
            //console.log("Agent=", this.agent);
            await this.agent.initialize()
            this.agents.set(agentInitDto.agentName, this.agent);
            console.log(init);
            //console.log("Agent=", this.agents.get(agentInitDto.agentName));
        }
        catch(error) {
            console.log(error);
            init = "Agent " + agentInitDto.agentName + " init failed with " + error;
        }
        return init;
    }     

    getAgentByName(agentName: string) {
        return this.agents.get(agentName);
    }

    async walletDelete(agentWalletDeleteDto: AgentWalletDeleteDto): Promise<string> {
        console.log("*** Agent Service: walletDelete");
        const agent: Agent = await this.getAgentByName(agentWalletDeleteDto.agentName);
        console.log("Agent wallet= wallet-id-", agentWalletDeleteDto.agentName)
        const result = agent.wallet.delete()
        return "Deleted";
    }

}
