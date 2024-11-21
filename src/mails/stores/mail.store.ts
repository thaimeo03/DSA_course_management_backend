import { IMailStrategy } from '../interfaces/mail-strategy.interface'
import { TemplateDelegate } from 'handlebars'
import Handlebars from 'handlebars'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Abstract class that provides basic functionality for sending emails using a
 * template and a mail strategy.
 *
 * @template TContext The type of the context object passed to the template.
 */
export abstract class MailStore<TContext> {
    /**
     * Constructor
     *
     * @param mailStrategy The mail strategy to use for sending the email.
     */
    constructor(private mailStrategy: IMailStrategy) {}

    /**
     * Sends an email using the specified template and mail strategy.
     *
     * @param context The context object passed to the template.
     * @param to The recipient of the email.
     */
    async send(context: TContext, to: string) {
        const templateName = this.getTemplateName()
        const template = this.loadTemplate(templateName)

        const html = template(context)
        const subject = this.getSubject()

        await this.mailStrategy.send({
            to,
            subject,
            html
        })
    }

    /**
     * Loads a template from a file and compiles it using Handlebars.
     *
     * @param templateName The name of the template to load.
     */
    private loadTemplate(templateName: string): TemplateDelegate {
        const templatesFolderPath = path.join(__dirname, 'templates')
        const templatePath = path.join(templatesFolderPath, templateName)

        const templateSource = fs.readFileSync(templatePath, 'utf-8')

        return Handlebars.compile(templateSource)
    }

    /**
     * Abstract methods
     */

    /**
     * Returns the name of the template to use for this email.
     *
     * @returns The name of the template.
     */
    protected abstract getTemplateName(): string

    /**
     * Returns the subject of the email.
     *
     * @returns The subject of the email.
     */
    protected abstract getSubject(): string
}
