import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { CouponsService } from './coupons.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { DataResponse } from 'common/core/response-success.core'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { UpdateCouponDto } from './dto/update-coupon.dto'

@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) {}

    @Post()
    async createCoupon(@Body() createCouponDto: CreateCouponDto) {
        const data = await this.couponsService.createCoupon(createCouponDto)

        return new DataResponse({ message: CouponMessages.CREATE_COUPON_SUCCESS, data })
    }

    @Delete(':code')
    async deleteCoupon(@Param('code') code: string) {
        await this.couponsService.deleteCoupon(code)

        return new DataResponse({ message: CouponMessages.DELETE_COUPON_SUCCESS })
    }

    @Patch(':id')
    async updateCoupon(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        await this.couponsService.updateCoupon(id, updateCouponDto)

        return new DataResponse({ message: CouponMessages.UPDATE_COUPON_SUCCESS })
    }
}
