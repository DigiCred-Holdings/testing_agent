import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';
import { AppModule } from './../src/app.module';

dotenv.config();

// Initialize Slack client if a bot token is provided; otherwise, set to null.
const slack = process.env.SLACK_BOT_TOKEN
  ? new WebClient(process.env.SLACK_BOT_TOKEN)
  : null;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL as string;

// Utility to generate a unique agent name.
let testCount = 0;
function generateAgentName(): string {
  return `Test_${Date.now()}_${++testCount}`;
}

// Increase Jest timeout to 30 seconds for asynchronous operations.
jest.setTimeout(30000);

describe('🚀 Full Agent-Message Flow', () => {
  let app: INestApplication;
  let agentName = '';
  let connectionId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // Note: We intentionally do not shut down the application later.
  });

  // Do not close the app so that localhost:3000/api stays as is.
  afterAll(async () => {
    // Instead of closing the application, override console logging to prevent errors
    // from asynchronous logs after tests are done.
    console.log = () => {};
    console.info = () => {};
    // (Optionally, if you want to close the app, comment out the next line.)
    // await app.close();
  });

  it('should initialize agent, create connection, and send message', async () => {
    // Step 1: Generate a unique agent name.
    agentName = generateAgentName();
    console.log(`🔄 Agent name: ${agentName}`);

    try {
      // Step 2: Initialize Agent
      console.log('➡️  [1] Initializing agent...');
      const initRes = await request(app.getHttpServer())
        .post('/agent/init')
        .send({ agentName });
      console.log('✅ Agent Init:', initRes.body);
      expect(initRes.status).toBe(201);

      // Step 3: Create Invitation
      console.log('➡️  [2] Creating invitation...');
      const inviteRes = await request(app.getHttpServer())
        .post('/connection/invite')
        .send({ agentName, label: `Invite for ${agentName}` });
      console.log('📨 Invite created:', inviteRes.body);
      expect(inviteRes.status).toBe(201);

      // Step 4: Get Connection List
      console.log('➡️  [3] Getting connection list...');
      const conListRes = await request(app.getHttpServer())
        .post('/connection/connections')
        .send({ agentName });
      console.log('📋 Connection list:', conListRes.body);
      if (!Array.isArray(conListRes.body)) {
        throw new Error(`Expected an array but got: ${JSON.stringify(conListRes.body)}`);
      }

      // Step 5: Extract Connection ID from a "completed" connection.
      const completed = conListRes.body.find((conn: any) => conn.state === 'completed');
      expect(completed).toBeDefined();
      connectionId = completed?.id || completed?.connection_id;
      console.log('🔗 Connection ID:', connectionId);

      // Step 6: Send Message using the extracted Connection ID.
      console.log('➡️  [4] Sending message...');
      const messageRes = await request(app.getHttpServer())
        .post('/message/sendmessage')
        .send({
          agentName,
          connectionID: connectionId, // Must exactly match the key required by the endpoint.
          messageBody: ':menu',       // The message content.
        });
      console.log('✉️  Message Response:', messageRes.body);
      expect(messageRes.status).toBe(201);

      // Step 7: Optional Slack Notification if configured.
      if (slack) {
        await slack.chat.postMessage({
          channel: SLACK_CHANNEL,
          text: `✅ Agent ${agentName} test completed successfully. Connection ID: ${connectionId}`,
        });
      }
    } catch (err: any) {
      console.error('❌ Test failed:', err.message || err);
      if (slack) {
        await slack.chat.postMessage({
          channel: SLACK_CHANNEL,
          text: `❌ Agent ${agentName} test failed: ${err.message || err}`,
        });
      }
      throw err;
    }
  });
});
