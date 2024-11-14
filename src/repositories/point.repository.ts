import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Point } from 'database/entities/point.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PointRepository extends Repository<Point> {
    constructor(@InjectRepository(Point) private pointRepository: Repository<Point>) {
        super(pointRepository.target, pointRepository.manager, pointRepository.queryRunner)
    }
}
