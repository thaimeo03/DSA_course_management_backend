import { MailSubject, MailTemplate } from 'common/constants/constraints/mail.constraint'
import { IPaymentSuccess } from '../interfaces/payment-success.interface'
import { MailStore } from './mail.store'

export class MailPaymentSuccessStore extends MailStore<IPaymentSuccess> {
    protected getSubject(): string {
        return MailSubject.PAYMENT_SUCCESS
    }

    protected getTemplateName(): string {
        return MailTemplate.PAYMENT_SUCCESS
    }
}
