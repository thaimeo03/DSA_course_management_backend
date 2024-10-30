import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Point } from 'database/entities/point.entity'
import { Repository } from 'typeorm'
import { CreatePointDto } from './dto/create-point.dto'
import { User } from 'database/entities/user.entity'
import { UserMessages } from 'common/constants/messages/user.message'

@Injectable()
export class PointsService {
    constructor(
        @InjectRepository(Point) private pointsRepository: Repository<Point>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    // 1. Check user exists
    // 2. Check point exists with user
    // 3. Save point
    async createPoint(createPointDto: CreatePointDto) {
        // 1
        const user = await this.userRepository.findOneBy({ id: createPointDto.userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        // 2
        const point = await this.pointsRepository.findOneBy({
            user: { id: user.id }
        })
        if (point) return

        // 3
        return this.pointsRepository.insert({
            ...createPointDto,
            user
        })
    }

    // Additional feature for dev
    async addPointForCurrentUsers() {
        const users = await this.userRepository.find()

        await Promise.all(
            users.map(async (user) => {
                await this.createPoint({ userId: user.id })
            })
        )
    }
}
