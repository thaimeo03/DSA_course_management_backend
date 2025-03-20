import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateLessonDto } from './dto/create-lesson.dto'
import * as _ from 'lodash'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { CourseRepository } from 'src/repositories/course.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'
import { LessonMessages } from 'common/constants/messages/lesson.message'

@Injectable()
export class LessonsService {
    constructor(
        private lessonRepository: LessonRepository,
        private courseRepository: CourseRepository
    ) {}

    // 1. Check course exists
    // 2. Check no exists
    // 3. Save lesson
    async createLesson(createLessonDto: CreateLessonDto) {
        // 1
        const course = await this.courseRepository.checkCourseExists({
            id: createLessonDto.courseId
        })

        // 2
        const lessonNo = await this.lessonRepository.findOne({
            where: {
                no: createLessonDto.no,
                course: {
                    id: createLessonDto.courseId
                }
            },
            relations: {
                course: true
            }
        })

        if (lessonNo)
            throw new BadRequestException(LessonMessages.NUMBER_ORDER_LESSON_ALREADY_EXISTS)

        // 3
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
        const lesson = await this.lessonRepository.checkLessonExists({ id })
        if (lesson.isActive)
            throw new BadRequestException(LessonMessages.CAN_NOT_DELETE_ACTIVE_LESSON)

        // 2
        await this.lessonRepository.delete(id)
    }

    // 1. Check active lesson
    // 2. Update lesson
    async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists({ id })
        if (lesson.isActive)
            throw new BadRequestException(LessonMessages.CAN_NOT_UPDATE_ACTIVE_LESSON)

        // 2
        await this.lessonRepository.update(id, updateLessonDto)
    }

    // 1. Check course exists
    // 2. Find all lessons
    async findLessonsByCourseId(courseId: string) {
        // 1
        await this.courseRepository.checkCourseExists({ id: courseId })

        // 2
        const lessons = await this.lessonRepository.findLessonsByCourseId(courseId, {
            select: {
                course: {}
            }
        })

        return lessons
    }

    // 1. Check course exists
    // 2. Find all active lessons
    async findActiveLessonsByCourseId(courseId: string) {
        // 1
        await this.courseRepository.checkCourseExists({ id: courseId })

        // 2
        const lessons = await this.lessonRepository.findLessonsByCourseId(courseId, {
            where: { isActive: true, isArchived: false },
            select: {
                course: {}
            }
        })

        return lessons
    }

    // 1. Check lesson exists
    // 2. Toggle isActive field
    async activeLesson(id: string) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists({ id })
        if (lesson.isActive) return

        // 2
        await this.lessonRepository.update(id, { isActive: true })
    }

    // 1. Check lesson exists
    // 2. Toggle isActive field
    async inactiveLesson(id: string) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists({ id })
        if (!lesson.isActive) return

        // 2
        await this.lessonRepository.update(id, { isActive: false })
    }

    // 1. Find lesson
    // 2. Toggle isArchived field = true
    async archiveLesson(id: string) {
        // 1
        const lesson = await this.lessonRepository.findOneBy({ id })
        if (!lesson) throw new BadRequestException(LessonMessages.LESSON_NOT_FOUND)
        if (lesson.isArchived) return

        // 2
        await this.lessonRepository.update(id, { isArchived: true })
    }

    // 1. Find lesson
    // 2. Toggle isArchived field = false
    async unarchiveLesson(id: string) {
        // 1
        const lesson = await this.lessonRepository.findOneBy({ id })
        if (!lesson) throw new BadRequestException(LessonMessages.LESSON_NOT_FOUND)
        if (!lesson.isArchived) return

        // 2
        await this.lessonRepository.update(id, { isArchived: false })
    }
}
