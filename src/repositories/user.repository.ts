import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner)
    }
}
