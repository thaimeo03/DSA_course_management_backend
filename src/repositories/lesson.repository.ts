import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessonMessages } from 'common/constants/messages/lesson.message'
import { Lesson } from 'database/entities/lesson.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class LessonRepository extends Repository<Lesson> {
    constructor(@InjectRepository(Lesson) private lessonRepository: Repository<Lesson>) {
        super(lessonRepository.target, lessonRepository.manager, lessonRepository.queryRunner)
    }

    // 1. Check lesson exists, if not throw error
    // 2. Return lesson
    async checkLessonExists(where: FindOptionsWhere<Lesson> | FindOptionsWhere<Lesson>[]) {
        // 1
        const lesson = await this.lessonRepository.findOneBy(where)
        if (!lesson) throw new NotFoundException(LessonMessages.LESSON_NOT_FOUND)

        // 2
        return lesson
    }
}
