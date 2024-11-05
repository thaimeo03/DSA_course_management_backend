import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PayDto } from './dto/pay.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Request, Response } from 'express'
import { DataResponse } from 'common/core/response-success.core'
import { PaymentMessages } from 'common/constants/messages/payment.message'
import { CallbackDto } from './dto/callback.dto'

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('pay')
    @UseGuards(AuthJwtGuard)
    async processPayment(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Body() payDto: PayDto
    ) {
        const userId = req.user['userId'] as string

        const url = await this.paymentsService.processPayment(userId, payDto)

        res.redirect(url)
    }

    @Get('callback')
    async callbackPayment(@Query() callbackDto: CallbackDto) {
        await this.paymentsService.callbackPayment(callbackDto)

        return new DataResponse({ message: PaymentMessages.PAYMENT_SUCCESS })
    }
}
