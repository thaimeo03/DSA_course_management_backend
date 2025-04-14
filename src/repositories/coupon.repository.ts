import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    GET_ALL_COUPONS_LIMIT,
    GET_ALL_COUPONS_PAGE
} from 'common/constants/constraints/coupon.constraint'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { Pagination } from 'common/core/pagination.core'
import { SortBy } from 'common/enums/coupons.enum'
import { HavePagination, Order } from 'common/enums/index.enum'
import { Coupon } from 'database/entities/coupon.entity'
import { GetAllCouponsDto, GetAllCouponsOptionDto } from 'src/coupons/dto/get-all-coupons.dto'
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(@InjectRepository(Coupon) private couponRepository: Repository<Coupon>) {
        super(couponRepository.target, couponRepository.manager, couponRepository.queryRunner)
    }

    /**
     * Checks if a coupon exists.
     * @param where - The conditions to find the coupon.
     * @returns The coupon if it exists.
     * @throws BadRequestException - If the coupon does not exist.
     */
    async checkCouponExists(where: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[]) {
        const coupon = await this.couponRepository.findOneBy(where)
        if (!coupon) throw new BadRequestException(CouponMessages.COUPON_NOT_FOUND)

        return coupon
    }

    async findAllCoupons(getAllCouponsDto: GetAllCouponsDto, options?: GetAllCouponsOptionDto) {
        // Determine pagination parameters
        const paging = getAllCouponsDto.paging || HavePagination.Y
        const page = getAllCouponsDto.page || GET_ALL_COUPONS_PAGE
        const limit = getAllCouponsDto.limit || GET_ALL_COUPONS_LIMIT
        const skip = (page - 1) * limit

        // Define filter conditions
        const where: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[] = {
            ...options?.where
        }
        const select = options?.select
        const relations = options?.relations

        // Set sorting order
        const order: FindOptionsOrder<Coupon> = {
            [getAllCouponsDto.sortBy || SortBy.UpdatedAt]: getAllCouponsDto.order || Order.Desc
        }

        // Get all coupons
        const coupons = await this.couponRepository.find({
            where,
            relations,
            skip: paging === HavePagination.N ? undefined : skip,
            take: paging === HavePagination.N ? undefined : limit,
            order: order,
            select
        })

        // Calculate pagination details
        const totalCount = await this.couponRepository.count({ where })
        const totalPage = paging === HavePagination.N ? 1 : Math.ceil(totalCount / limit)
        const pagination = new Pagination({
            limit: paging === HavePagination.N ? totalCount : limit,
            currentPage: paging === HavePagination.N ? 1 : page,
            totalPage,
            totalElements: totalCount
        })

        // Return courses and pagination information
        return {
            coupons,
            pagination
        }
    }
}
