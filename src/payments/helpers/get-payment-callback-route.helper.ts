export const getPaymentCallbackRoute = (host: string, success: number, paymentId: string) => {
    return `${host}/payments/callback?success=${success}&paymentId=${paymentId}`
}
