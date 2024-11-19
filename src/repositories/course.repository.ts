import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    FIND_ALL_COURSES_LIMIT,
    FIND_ALL_COURSES_PAGE
} from 'common/constants/constraints/course.constraint'
import { CourseMessages } from 'common/constants/messages/course.message'
import { Pagination } from 'common/core/pagination.core'
import { SortBy } from 'common/enums/courses.enum'
import { Order } from 'common/enums/index.enum'
import { Course } from 'database/entities/course.entity'
import { FindAllCourseOptionDto } from 'src/courses/dto/find-all-course-option.dto'
import { FindAllCourseDto } from 'src/courses/dto/find-all-course.dto'
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class CourseRepository extends Repository<Course> {
    constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {
        super(courseRepository.target, courseRepository.manager, courseRepository.queryRunner)
    }

    // 1. Check course exists, or archived, if not throw error
    // 2. Return course
    async checkCourseExists(where: FindOptionsWhere<Course> | FindOptionsWhere<Course>[]) {
        // 1
        const course = await this.courseRepository.findOneBy(where)
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)
        if (course.isArchived) throw new NotFoundException(CourseMessages.COURSE_ARCHIVED)

        // 2
        return course
    }

    // 1. Filter courses
    // 2. Get all courses
    // 3. Pagination
    async findAllCourses(findAllCoursesDto: FindAllCourseDto, options?: FindAllCourseOptionDto) {
        // 1
        const page = findAllCoursesDto.page || FIND_ALL_COURSES_PAGE
        const limit = findAllCoursesDto.limit || FIND_ALL_COURSES_LIMIT
        const skip = (page - 1) * limit
        const where: FindOptionsWhere<Course> | FindOptionsWhere<Course>[] = {
            isArchived: false,
            ...options?.where
        }
        const select = options?.select

        const order: FindOptionsOrder<Course> = {
            [findAllCoursesDto.sortBy || SortBy.CreatedAt]: findAllCoursesDto.order || Order.Desc
        }

        // 2
        const courses = await this.courseRepository.find({
            where,
            skip,
            take: limit,
            order: order,
            select
        })

        // 3
        const totalCount = await this.courseRepository.count({ where })
        const totalPage = Math.ceil(totalCount / limit)
        const pagination = new Pagination({ limit, currentPage: page, totalPage })

        return {
            courses,
            pagination
        }
    }
}
