import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CourseMessages } from 'common/constants/messages/course.message'
import { Course } from 'database/entities/course.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CoursesRepository extends Repository<Course> {
    constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {
        super(courseRepository.target, courseRepository.manager, courseRepository.queryRunner)
    }

    // 1. Check course exists, if not throw error
    // 2. Return course
    async checkCourseExists(id: string) {
        // 1
        const course = await this.courseRepository.findOneBy({ id })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

        // 2
        return course
    }
}
