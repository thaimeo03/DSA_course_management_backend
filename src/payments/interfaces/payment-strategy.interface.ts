export interface IPaymentStrategy {
    pay(userId: string, courseId: string): Promise<string>
}
