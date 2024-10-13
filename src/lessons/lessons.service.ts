import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { CourseMessages } from 'common/constants/messages/course.message'
import { LessonMessages } from 'common/constants/messages/lesson.message'
import * as _ from 'lodash'
import { Lesson } from 'database/entities/lesson.entity'
import { Course } from 'database/entities/course.entity'
import { UpdateLessonDto } from './dto/update-lesson.dto'

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        @InjectRepository(Course) private courseRepository: Repository<Course>
    ) {}

    // 1. Check course exists
    // 2. Save lesson
    async createLesson(createLessonDto: CreateLessonDto) {
        // 1
        const course = await this.courseRepository.findOneBy({ id: createLessonDto.courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

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
        const lesson = await this.lessonRepository.findOneBy({ id })
        if (!lesson) throw new NotFoundException(LessonMessages.LESSON_NOT_FOUND)

        // 2
        await this.lessonRepository.delete(id)
    }

    // 1. Check lesson exists
    // 2. Update lesson
    async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
        // 1
        const lesson = await this.lessonRepository.findOneBy({ id })
        if (!lesson) throw new NotFoundException(LessonMessages.LESSON_NOT_FOUND)

        // 2
        await this.lessonRepository.update(id, updateLessonDto)
    }

    // 1. Check course exists
    // 2. Find all lessons
    async findLessonsByCourseId(courseId: string) {
        // 1
        const course = await this.courseRepository.findOneBy({ id: courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

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
}
