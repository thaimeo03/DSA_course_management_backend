import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserMessages } from 'common/constants/messages/user.message'
import { User } from 'database/entities/user.entity'
import { FindOptionsWhere, Repository, Like, ILike } from 'typeorm'
import { GetAccountsDto } from 'src/users/dto/get-accounts.dto'
import { GetAccountsOptionDto } from 'src/users/dto/get-accounts-option.dto'
import { Pagination } from 'common/core/pagination.core'
import { HavePagination } from 'common/enums/index.enum'

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner)
    }

    // 1. Check user exists, if not throw error
    // 2. Return user
    async checkUserExists(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
        // 1
        const user = await this.userRepository.findOneBy(where)
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        // 2
        return user
    }

    /**
     * Finds all accounts with pagination, sorting, and filtering.
     * @param getAccountsDto - The data to filter, sort and paginate the accounts.
     * @param options - Additional options for finding accounts.
     * @returns An object containing the list of accounts and pagination details.
     */
    async getAccounts(getAccountsDto: GetAccountsDto, options?: GetAccountsOptionDto) {
        // Determine pagination parameters
        const paging = getAccountsDto.paging || HavePagination.Y
        const page = getAccountsDto.page || 1
        const limit = getAccountsDto.limit || 10
        const skip = (page - 1) * limit

        // Define filter conditions
        let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {
            ...options?.where
        }

        // Add search filter if provided
        if (getAccountsDto.search) {
            where = [
                { ...where, fullName: ILike(`%${getAccountsDto.search}%`) },
                { ...where, email: ILike(`%${getAccountsDto.search}%`) }
            ]
        }

        const select = options?.select
        const relations = options?.relations

        // Get all accounts matching the criteria
        const accounts = await this.userRepository.find({
            where,
            relations,
            skip: paging === HavePagination.N ? undefined : skip,
            take: paging === HavePagination.N ? undefined : limit,
            order: {
                createdAt: 'DESC'
            },
            select
        })

        // Calculate pagination details
        const totalCount = await this.userRepository.count({ where })
        const totalPage = paging === HavePagination.N ? 1 : Math.ceil(totalCount / limit)
        const pagination = new Pagination({
            limit: paging === HavePagination.N ? totalCount : limit,
            currentPage: paging === HavePagination.N ? 1 : page,
            totalPage,
            totalElements: totalCount
        })

        // Return accounts and pagination information
        return {
            accounts,
            pagination
        }
    }
}
