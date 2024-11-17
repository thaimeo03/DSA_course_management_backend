import { Injectable } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { FindAllCourseDto } from './dto/find-all-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { ImagesService } from 'src/images/images.service'
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
        const course = await this.courseRepository.checkCourseExists({ id })

        // 2
        const image = await this.imageRepository.findOneBy({ url: course.thumbnail })
        if (image) {
            await this.imageService.deleteImages([image.url])
        }

        // 3
        await this.courseRepository.delete(id)
    }

    async findAllActiveCourses(findAllCoursesDto: FindAllCourseDto) {
        return this.courseRepository.findAllCourses(findAllCoursesDto, {
            where: { isActive: true }
        })
    }

    async findAllCourses(findAllCoursesDto: FindAllCourseDto) {
        return this.courseRepository.findAllCourses(findAllCoursesDto)
    }

    // 1. Check course
    // 2. Delete old image on cloudinary if image changed and exists
    // 3. Update course
    async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
        // 1
        const course = await this.courseRepository.checkCourseExists({ id })

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
        const course = await this.courseRepository.checkCourseExists({ id })

        // 2
        await this.courseRepository.update(id, { isActive: !course.isActive })
    }
}
