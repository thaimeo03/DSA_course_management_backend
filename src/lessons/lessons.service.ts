import { Injectable } from '@nestjs/common'
import { CreateLessonDto } from './dto/create-lesson.dto'
import * as _ from 'lodash'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { CourseRepository } from 'src/repositories/course.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'

@Injectable()
export class LessonsService {
    constructor(
        private lessonRepository: LessonRepository,
        private courseRepository: CourseRepository
    ) {}

    // 1. Check course exists
    // 2. Save lesson
    async createLesson(createLessonDto: CreateLessonDto) {
        // 1
        const course = await this.courseRepository.checkCourseExists(createLessonDto.courseId)

        // 2
        const lesson = await this.lessonRepository.save({
            ...createLessonDto,
            course
        })

        return _.omit(lesson, ['course'])
    }

    // 1. Check lesson exists
    // 2. Delete lesson
    async deleteLesson(id: string) {
        // 1
        await this.lessonRepository.checkLessonExists(id)

        // 2
        await this.lessonRepository.delete(id)
    }

    // 1. Check lesson exists
    // 2. Update lesson
    async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
        // 1
        await this.lessonRepository.checkLessonExists(id)

        // 2
        await this.lessonRepository.update(id, updateLessonDto)
    }

    // 1. Check course exists
    // 2. Find all lessons
    async findLessonsByCourseId(courseId: string) {
        // 1
        await this.courseRepository.checkCourseExists(courseId)

        // 2
        const lessons = await this.lessonRepository.find({
            where: { course: { id: courseId } },
            relations: { course: true },
            order: { createdAt: 'ASC' },
            select: {
                course: {}
            }
        })

        return lessons
    }

    // 1. Check lesson exists
    // 2. Toggle isActive field
    async toggleActiveLesson(id: string) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists(id)

        // 2
        await this.lessonRepository.update(id, { isActive: !lesson.isActive })
    }
}
