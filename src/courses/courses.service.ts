import { Injectable } from '@nestjs/common'
import { Course } from 'database/entities/course.entity'
import { FindOptionsOrder } from 'typeorm'
import { CreateCourseDto } from './dto/create-course.dto'
import { FindAllCourseDto } from './dto/find-all-course.dto'
import { Pagination } from 'common/core/pagination.core'
import { UpdateCourseDto } from './dto/update-course.dto'
import { ImagesService } from 'src/images/images.service'
import {
    FIND_ALL_COURSES_LIMIT,
    FIND_ALL_COURSES_PAGE
} from 'common/constants/constraints/course.constraint'
import { Order } from 'common/enums/index.enum'
import { SortBy } from 'common/enums/courses.enum'
import { CourseRepository } from 'src/repositories/course.repository'
import { ImageRepository } from 'src/repositories/image.repository'

@Injectable()
export class CoursesService {
    constructor(
        private courseRepository: CourseRepository,
        private imageRepository: ImageRepository,
        private imageService: ImagesService
    ) {}

    async createCourse(createCourseDto: CreateCourseDto) {
        const course = await this.courseRepository.save(createCourseDto)
        return course
    }

    // 1. Check course
    // 2. Delete image on cloudinary if exists
    // 3. Delete course
    async deleteCourse(id: string) {
        // 1
        const course = await this.courseRepository.checkCourseExists(id)

        // 2
        const image = await this.imageRepository.findOneBy({ url: course.thumbnail })
        if (image) {
            await this.imageService.deleteImages([image.url])
        }

        // 3
        await this.courseRepository.delete(id)
    }

    // 1. Filter courses
    // 2. Get all courses
    // 3. Pagination
    async findAllCourses(findAllCoursesDto: FindAllCourseDto) {
        // 1
        const page = findAllCoursesDto.page || FIND_ALL_COURSES_PAGE
        const limit = findAllCoursesDto.limit || FIND_ALL_COURSES_LIMIT
        const skip = (page - 1) * limit

        const order: FindOptionsOrder<Course> = {
            [findAllCoursesDto.sortBy || SortBy.CreatedAt]: findAllCoursesDto.order || Order.Desc
        }

        // 2
        const courses = await this.courseRepository.find({
            skip,
            take: limit,
            order: order
        })

        // 3
        const totalPage = Math.ceil((await this.courseRepository.count()) / limit)
        const pagination = new Pagination({ limit, currentPage: page, totalPage })

        return {
            courses,
            pagination
        }
    }

    // 1. Check course
    // 2. Delete old image on cloudinary if image changed and exists
    // 3. Update course
    async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
        // 1
        const course = await this.courseRepository.checkCourseExists(id)

        // 2
        if (updateCourseDto.thumbnail !== course.thumbnail) {
            const oldImage = await this.imageRepository.findOneBy({ url: course.thumbnail })
            if (oldImage) {
                await this.imageService.deleteImages([oldImage.url])
            }
        }

        // 3
        await this.courseRepository.update(id, updateCourseDto)
    }

    // 1. Check course
    // 2. Toggle isActive field
    async toggleActiveCourse(id: string) {
        // 1
        const course = await this.courseRepository.checkCourseExists(id)

        // 2
        await this.courseRepository.update(id, { isActive: !course.isActive })
    }
}
