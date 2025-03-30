import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessageSendDto } from './dto/message.send.dto';
import { BasicMessageRecord } from '@credo-ts/core';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('/sendmessage')
    async sendMessage(@Body() messageSendDto: MessageSendDto): Promise<BasicMessageRecord> {
        return await this.messageService.sendMessage(messageSendDto);
    }

}
