import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PayDto } from './dto/pay.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Request, Response } from 'express'
import { CallbackDto } from './dto/callback.dto'
import { ConfigService } from '@nestjs/config'
import { DataResponse } from 'common/core/response-success.core'
import { PaymentMessages } from 'common/constants/messages/payment.message'

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private configService: ConfigService
    ) {}

    @Post('pay')
    @UseGuards(AuthJwtGuard)
    async processPayment(@Req() req: Request, @Body() payDto: PayDto) {
        const userId = req.user['userId'] as string

        const url = await this.paymentsService.processPayment(userId, payDto)

        return new DataResponse({
            message: PaymentMessages.PROCESS_PAYMENT_SUCCESS,
            data: { url }
        })
    }

    @Get('callback')
    async callbackPayment(
        @Res({ passthrough: true }) res: Response,
        @Query() callbackDto: CallbackDto
    ) {
        const data = await this.paymentsService.callbackPayment(callbackDto)

        if (data === true) res.redirect(this.configService.get('CLIENT_PAYMENT_SUCCESS_URL'))
        else res.redirect(this.configService.get('CLIENT_PAYMENT_FAIL_URL'))
    }
}
