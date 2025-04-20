import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit
} from '@nestjs/common'
import { CreatePointDto } from './dto/create-point.dto'
import { IncreasePointDto } from './dto/increase-point.dto'
import { SubmissionStatus } from 'common/enums/submissions.enum'
import { PointRepository } from 'src/repositories/point.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { SubmissionRepository } from 'src/repositories/submission.repository'
import { PointMessages } from 'common/constants/messages/point.message'
import Redis from 'ioredis'
import { RedisUtil } from 'common/utils/redis.util'

@Injectable()
export class PointsService implements OnModuleInit {
    private readonly logger = new Logger(PointsService.name)

    constructor(
        private pointsRepository: PointRepository,
        private userRepository: UserRepository,
        private submissionRepository: SubmissionRepository,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis
    ) {}

    async onModuleInit() {
        await this.syncPointsToRedis()
    }

    // 1. Check user exists
    // 2. Check point exists with user
    // 3. Save point
    async createPoint(createPointDto: CreatePointDto) {
        // 1
        const user = await this.userRepository.checkUserExists({ id: createPointDto.userId })

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

        // 1. Check submission exists with user id, problem id and passed status
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

        // 2. If number of submission equals 1, increase point
        if (cnt === 1) {
            const newValue = point.value + value

            // Update database
            await this.pointsRepository.update(point.id, { value: newValue })

            // Update sorted set in Redis
            await this.redisClient.zadd(RedisUtil.getRanksKey(), newValue, userId)
        }
    }

    async getMyPoints(userId: string) {
        const point = await this.pointsRepository.findOneBy({
            user: { id: userId }
        })

        if (!point) throw new InternalServerErrorException(PointMessages.POINT_NOT_FOUND)

        return point
    }

    async syncPointsToRedis() {
        try {
            // Get all points from database
            const points = await this.pointsRepository.find({
                relations: ['user']
            })

            // Delete all old data
            await this.redisClient.del(RedisUtil.getRanksKey())

            if (!points.length) return

            const zaddArgs = points.flatMap((point) => [point.value, point.user.id])

            // Add new data to Redis sorted set
            await this.redisClient.zadd(RedisUtil.getRanksKey(), ...zaddArgs)

            this.logger.log('Synchronized points to Redis successfully')
        } catch (error) {
            this.logger.error('Error syncing points to Redis:', error)
        }
    }
}
