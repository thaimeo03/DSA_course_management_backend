import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PayDto } from './dto/pay.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Request } from 'express'
import { DataResponse } from 'common/core/response-success.core'
import { PaymentMessages } from 'common/constants/messages/payment.message'

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('pay')
    @UseGuards(AuthJwtGuard)
    async processPayment(@Req() req: Request, @Body() payDto: PayDto) {
        const userId = req.user['userId'] as string

        const data = await this.paymentsService.processPayment(userId, payDto)

        return new DataResponse({ message: PaymentMessages.PROCESS_PAYMENT_SUCCESS, data })
    }
}
