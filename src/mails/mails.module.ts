import { Module } from '@nestjs/common'
import { MailsService } from './mails.service'
import { MailFactory } from './mail.factory'

@Module({
    providers: [MailsService, MailFactory],
    exports: [MailsService]
})
export class MailsModule {}
