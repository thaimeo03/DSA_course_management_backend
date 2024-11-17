import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserMessages } from 'common/constants/messages/user.message'
import { User } from 'database/entities/user.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

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
}
