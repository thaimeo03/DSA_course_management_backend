import { ConfigService } from '@nestjs/config'
import { createTransport, Transporter } from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import { IGmailStrategy } from '../interfaces/mail-strategy.interface'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { MailMessages } from 'common/constants/messages/mail.message'
import { from, lastValueFrom, retry, tap } from 'rxjs'

/**
 * Strategy for sending emails using Gmail
 */
@Injectable()
export class GmailStrategy implements IGmailStrategy {
    private transporter: Transporter
    private readonly logger = new Logger(GmailStrategy.name)

    constructor(private configService: ConfigService) {
        this.initTransporter()
    }

    /**
     * Send email
     *
     * @param mailOptions
     */
    async send(mailOptions: MailOptions): Promise<void> {
        try {
            /**
             * Send email and retry up to 3 times if failed
             */
            await lastValueFrom(
                from(this.transporter.sendMail(mailOptions)).pipe(
                    tap({
                        error: () => {
                            this.logger.warn(`Retrying email sending...`)
                        }
                    }),
                    retry(3)
                )
            )

            this.logger.log(MailMessages.SEND_MAIL_SUCCESS)
        } catch (error) {
            /**
             * Log error and throw InternalServerErrorException
             */
            this.logger.error(MailMessages.SEND_MAIL_FAILED, error)
            throw new InternalServerErrorException(MailMessages.SEND_MAIL_FAILED)
        }
    }

    /**
     * Initialize transporter instance
     */
    private initTransporter() {
        this.transporter = createTransport(
            {
                host: this.configService.get('MAIL_HOST'),
                auth: {
                    user: this.configService.get('MAIL_USER'),
                    pass: this.configService.get('MAIL_PASSWORD')
                }
            },
            {
                from: {
                    name: this.configService.get('MAIL_FROM_NAME'),
                    address: this.configService.get('MAIL_FROM_ADDRESS')
                }
            }
        )
    }
}
