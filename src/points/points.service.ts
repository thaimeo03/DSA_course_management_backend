import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePointDto } from './dto/create-point.dto'
import { UserMessages } from 'common/constants/messages/user.message'
import { IncreasePointDto } from './dto/increase-point.dto'
import { SubmissionStatus } from 'common/enums/submissions.enum'
import { PointRepository } from 'src/repositories/point.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { SubmissionRepository } from 'src/repositories/submission.repository'

@Injectable()
export class PointsService {
    constructor(
        private pointsRepository: PointRepository,
        private userRepository: UserRepository,
        private submissionRepository: SubmissionRepository
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

    // 1. Count number of submission based on user id, problem id and passed status
    // 2. Increase point if number of submission equals 1 (Only first finished submission with passed status)
    async increasePoint(increasePointDto: IncreasePointDto) {
        const { userId, problemId, value } = increasePointDto

        // 1
        const [cnt, point] = await Promise.all([
            this.submissionRepository.count({
                where: {
                    user: {
                        id: userId
                    },
                    problem: {
                        id: problemId
                    },
                    status: SubmissionStatus.Passed
                }
            }),
            this.pointsRepository.findOneBy({ user: { id: userId } })
        ])

        // 2
        if (cnt === 1) {
            return await this.pointsRepository.update(point.id, { value: point.value + value })
        }
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
