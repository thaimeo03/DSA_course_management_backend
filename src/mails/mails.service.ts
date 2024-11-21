import { Injectable } from '@nestjs/common'
import { MailFactory } from './mail.factory'
import { IPaymentSuccess } from './interfaces/payment-success.interface'
import { MailPaymentSuccessStore } from './stores/mail-payment-success.store'

@Injectable()
export class MailsService {
    constructor(private mailFactory: MailFactory) {}

    /**
     * Send an email to the user to announce the payment success
     *
     * @param paymentSuccess The payment success data
     */
    async sendMailPaymentSuccess(paymentSuccess: IPaymentSuccess) {
        const mailStrategy = await this.mailFactory.getMailStrategy()
        const mailPaymentSuccessStore = new MailPaymentSuccessStore(mailStrategy)

        mailPaymentSuccessStore.send(paymentSuccess, paymentSuccess.userEmail)
    }
}
