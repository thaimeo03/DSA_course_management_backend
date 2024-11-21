import { MailOptions } from 'nodemailer/lib/sendmail-transport'

/**
 * Interface representing a generic mail strategy.
 * @template TMailOptions - The type of mail options used by the strategy.
 */
export interface IMail<TMailOptions> {
    send(mailOptions: TMailOptions): Promise<void>
}

/**
 * Type representing the Gmail mail strategy.
 * Uses Nodemailer's MailOptions type.
 */
export type IGmailStrategy = IMail<MailOptions>

/**
 * Type representing another mail strategy with custom options.
 */
export type IAnotherStrategy = IMail<{
    from?: string | { name: string; address: string }
    to?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    subject?: string
    text?: string
    html?: string
    attachments?: {
        filename?: string
        content?: string | Buffer
        path?: string
        contentType?: string
    }[]
}>

/**
 * Union type representing any mail strategy.
 */
export type IMailStrategy = IGmailStrategy | IAnotherStrategy
