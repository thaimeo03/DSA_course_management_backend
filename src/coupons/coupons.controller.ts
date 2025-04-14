import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CouponsService } from './coupons.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { DataResponse, DataResponseWithPagination } from 'common/core/response-success.core'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { ApplyCouponDto } from './dto/apply-coupon.dto'
import { GetAllCouponsDto } from './dto/get-all-coupons.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Roles } from 'common/decorators/roles.de'
import { Role } from 'common/enums/users.enum'

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

    @Post('apply')
    async applyCouponForUser(@Body() applyCouponDto: ApplyCouponDto) {
        await this.couponsService.applyCouponForUser(applyCouponDto)

        return new DataResponse({ message: CouponMessages.APPLY_COUPON_SUCCESS })
    }

    @Get()
    @UseGuards(AuthJwtGuard)
    @Roles(Role.Admin)
    async getAllCoupons(@Query() getAllCouponsDto: GetAllCouponsDto) {
        const { coupons, pagination } = await this.couponsService.getAllCoupons(getAllCouponsDto)

        return new DataResponseWithPagination({
            message: CouponMessages.GET_ALL_COUPONS_SUCCESS,
            data: coupons,
            pagination: pagination
        })
    }
}
