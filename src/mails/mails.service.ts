import { Injectable } from '@nestjs/common'
import { MailFactory } from './mail.factory'

@Injectable()
export class MailsService {
    constructor(private mailFactory: MailFactory) {}
}
