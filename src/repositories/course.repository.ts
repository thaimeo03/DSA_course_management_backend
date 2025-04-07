import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    FIND_ALL_COURSES_LIMIT,
    FIND_ALL_COURSES_PAGE
} from 'common/constants/constraints/course.constraint'
import { CourseMessages } from 'common/constants/messages/course.message'
import { Pagination } from 'common/core/pagination.core'
import { SortBy } from 'common/enums/courses.enum'
import { HavePagination, Order } from 'common/enums/index.enum'
import { PaymentStatus } from 'common/enums/payment.enum'
import { Course } from 'database/entities/course.entity'
import { FindAllCourseOptionDto } from 'src/courses/dto/find-all-course-option.dto'
import { FindAllCourseDto } from 'src/courses/dto/find-all-course.dto'
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class CourseRepository extends Repository<Course> {
    constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {
        super(courseRepository.target, courseRepository.manager, courseRepository.queryRunner)
    }

    /**
     * Checks if a course exists and is not archived.
     * @param where - The conditions to find the course.
     * @returns The course if it exists and is not archived.
     * @throws NotFoundException - If the course does not exist or is archived.
     */
    async checkCourseExists(where: FindOptionsWhere<Course> | FindOptionsWhere<Course>[]) {
        // Find the course by given conditions
        const course = await this.courseRepository.findOneBy(where)
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)
        if (course.isArchived) throw new NotFoundException(CourseMessages.COURSE_ARCHIVED)

        // Return the course if found and not archived
        return course
    }

    /**
     * Finds all courses with pagination, sorting, and filtering.
     * @param findAllCoursesDto - The data to filter, sort and paginate the courses.
     * @param options - Additional options for finding courses.
     * @returns An object containing the list of courses and pagination details.
     */
    async findAllCourses(findAllCoursesDto: FindAllCourseDto, options?: FindAllCourseOptionDto) {
        // Determine pagination parameters
        const paging = findAllCoursesDto.paging || HavePagination.Y
        const page = findAllCoursesDto.page || FIND_ALL_COURSES_PAGE
        const limit = findAllCoursesDto.limit || FIND_ALL_COURSES_LIMIT
        const skip = (page - 1) * limit

        // Define filter conditions
        const where: FindOptionsWhere<Course> | FindOptionsWhere<Course>[] = {
            isArchived: false,
            ...options?.where
        }
        const select = options?.select
        const relations = options?.relations

        // Set sorting order
        const order: FindOptionsOrder<Course> = {
            [findAllCoursesDto.sortBy || SortBy.CreatedAt]: findAllCoursesDto.order || Order.Desc
        }

        // Get all courses matching the criteria
        const courses = await this.courseRepository.find({
            where,
            relations,
            skip: paging === HavePagination.N ? undefined : skip,
            take: paging === HavePagination.N ? undefined : limit,
            order: order,
            select
        })

        // Calculate pagination details
        const totalCount = await this.courseRepository.count({ where })
        const totalPage = paging === HavePagination.N ? 1 : Math.ceil(totalCount / limit)
        const pagination = new Pagination({
            limit: paging === HavePagination.N ? totalCount : limit,
            currentPage: paging === HavePagination.N ? 1 : page,
            totalPage,
            totalElements: totalCount
        })

        // Return courses and pagination information
        return {
            courses,
            pagination
        }
    }

    /**
     * Retrieves the details of a course by its ID and active status.
     *
     * @param id - The unique identifier of the course.
     * @param isActive - The active status of the course.
     * @returns The details of the course including id, title, description, thumbnail, price, createdAt, and updatedAt.
     * @throws {BadRequestException} If the course is not found.
     */
    async getDetailCourse(id: string, isActive: boolean) {
        const course = await this.courseRepository.findOne({
            where: { id, isActive, isArchived: false },
            select: {
                id: true,
                title: true,
                videoUrl: true,
                description: true,
                thumbnail: true,
                price: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!course) throw new BadRequestException(CourseMessages.COURSE_NOT_FOUND)

        return course
    }

    async isPurchaseCourse(courseId: string, userId: string) {
        const course = await this.courseRepository.findOne({
            relations: {
                payments: {
                    user: true
                }
            },
            where: {
                payments: {
                    user: {
                        id: userId
                    },
                    course: {
                        id: courseId
                    },

                    status: PaymentStatus.Completed
                }
            }
        })

        return course ? true : false
    }
}
