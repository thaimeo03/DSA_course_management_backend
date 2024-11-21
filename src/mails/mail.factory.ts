import { Injectable, NotFoundException, Type } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IMailStrategy } from './interfaces/mail-strategy.interface'
import { ModuleRef } from '@nestjs/core'
import { GmailStrategy } from './strategies/gmail.strategy'
import { MailProvider } from 'common/enums/mails.enum'
import { MailMessages } from 'common/constants/messages/mail.message'

/**
 * This factory is responsible for providing a mail strategy based on the
 * mail provider configuration.
 *
 * @see MailProvider
 * @see IMailStrategy
 */
@Injectable()
export class MailFactory {
    constructor(
        private configService: ConfigService,
        private moduleRef: ModuleRef
    ) {}

    /**
     * The map of mail provider types and their corresponding mail strategy
     * classes.
     */
    private mailStrategies = new Map<string, Type<IMailStrategy>>([
        [MailProvider.GMAIL, GmailStrategy]
    ])

    /**
     * Get an instance of the mail strategy based on the mail provider type.
     *
     * @returns A promise that resolves to an instance of the mail strategy.
     * @throws NotFoundException if the mail provider type is not found.
     */
    async getMailStrategy(): Promise<IMailStrategy> {
        const providerType = this.configService.get<string>('MAIL_PROVIDER')
        const mailStrategy = this.mailStrategies.get(providerType)
        if (!mailStrategy) {
            throw new NotFoundException(MailMessages.MAIL_PROVIDER_NOT_FOUND)
        }

        return await this.moduleRef.create(mailStrategy)
    }
}
