import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { FindAllCourseDto } from './dto/find-all-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { ImagesService } from 'src/images/images.service'
import { CourseRepository } from 'src/repositories/course.repository'
import { ImageRepository } from 'src/repositories/image.repository'
import { CourseMessages } from 'common/constants/messages/course.message'
import { PaymentFacade } from 'src/payments/payment.facade'
import { DetailCourseDto } from './dto/detail-course.dto'

@Injectable()
export class CoursesService {
    constructor(
        private courseRepository: CourseRepository,
        private imageRepository: ImageRepository,
        private imageService: ImagesService,
        private paymentFacade: PaymentFacade
    ) {}

    /**
     * Creates a new course with the given data.
     * @param createCourseDto the data of the course to be created.
     * @returns the created course.
     */
    async createCourse(createCourseDto: CreateCourseDto) {
        const course = await this.courseRepository.save(createCourseDto)

        return course
    }

    /**
     * Deletes a course and its associated image.
     * @param id - The ID of the course to be deleted.
     */
    async deleteCourse(id: string) {
        // Check if the course exists
        const course = await this.courseRepository.checkCourseExists({ id })

        // Delete associated image on Cloudinary if it exists
        const image = await this.imageRepository.findOneBy({ url: course.thumbnail })
        if (image) {
            await this.imageService.deleteImages([image.url])
        }

        // Delete the course from the repository
        await this.courseRepository.delete(id)
    }

    /**
     * Finds all active courses.
     * @param findAllCoursesDto - The data to filter, sort and paginate the courses.
     * @returns The list of active courses.
     */
    async findAllActiveCourses(findAllCoursesDto: FindAllCourseDto) {
        // Find all courses with the given filter, sort and pagination
        // and also apply the condition of isActive = true
        return this.courseRepository.findAllCourses(findAllCoursesDto, {
            where: { isActive: true }
        })
    }

    /**
     * Finds all courses with the given filter, sort and pagination.
     * @param findAllCoursesDto - The data to filter, sort and paginate the courses.
     * @returns The list of courses.
     */
    async findAllCourses(findAllCoursesDto: FindAllCourseDto) {
        return this.courseRepository.findAllCourses(findAllCoursesDto)
    }

    /**
     * Retrieves detailed information about a specific course.
     *
     * @param id - The unique identifier of the course.
     * @param detailCourseDto - An object containing additional details for the course query.
     * @returns A promise that resolves to the detailed course information.
     */
    async getDetailCourse(id: string, detailCourseDto: DetailCourseDto) {
        return this.courseRepository.getDetailCourse(id, detailCourseDto.isActive)
    }

    /**
     * Updates a course.
     * @param id - The ID of the course to be updated.
     * @param updateCourseDto - The data to update the course.
     */
    async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
        // Check active course
        const course = await this.courseRepository.checkCourseExists({ id })
        if (course.isActive)
            throw new BadRequestException(CourseMessages.CAN_NOT_UPDATE_ACTIVE_COURSE)

        // Delete old image on cloudinary if image changed and exists
        if (updateCourseDto.thumbnail !== course.thumbnail) {
            const oldImage = await this.imageRepository.findOneBy({ url: course.thumbnail })
            if (oldImage) {
                await this.imageService.deleteImages([oldImage.url])
            }
        }

        // Update course
        await this.courseRepository.update(id, updateCourseDto)
    }

    /**
     * Activates a course.
     * @param id - The ID of the course to be activated.
     */
    async activateCourse(id: string) {
        // Check course
        const course = await this.courseRepository.checkCourseExists({ id })
        if (course.isActive) {
            return
        }

        // Update isActive field = true
        await this.courseRepository.update(id, { isActive: true })

        // Update products and prices in payment methods after course is activated
        await this.paymentFacade.updateCourse(course)
    }

    /**
     * Inactivates a course.
     * @param id - The ID of the course to be inactivated.
     */
    async inactiveCourse(id: string) {
        // Check course
        const course = await this.courseRepository.checkCourseExists({ id })
        if (!course.isActive) return

        // Update isActive field = false
        await this.courseRepository.update(id, { isActive: false })
    }

    /**
     * Archives a course.
     * @param id - The ID of the course to be archived.
     */
    async archivedCourse(id: string) {
        // Find course
        const course = await this.courseRepository.findOneBy({ id })
        if (!course) throw new BadRequestException(CourseMessages.COURSE_NOT_FOUND)
        if (course.isArchived) return

        // Update isArchived field = true
        await this.courseRepository.update(id, { isArchived: true })
    }

    /**
     * Unarchives a course.
     * @param id - The ID of the course to be unarchived.
     */
    async unarchiveCourse(id: string) {
        // Find course
        const course = await this.courseRepository.findOneBy({ id })
        if (!course) throw new BadRequestException(CourseMessages.COURSE_NOT_FOUND)
        if (!course.isArchived) return

        // Update isArchived field = false
        await this.courseRepository.update(id, { isArchived: false })
    }
}
