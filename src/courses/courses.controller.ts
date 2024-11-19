import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { DataResponse, DataResponseWithPagination } from 'common/core/response-success.core'
import { CourseMessages } from 'common/constants/messages/course.message'
import { FindAllCourseDto } from './dto/find-all-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post()
    async createCourse(@Body() createCourseDto: CreateCourseDto) {
        const data = await this.coursesService.createCourse(createCourseDto)

        return new DataResponse({
            message: CourseMessages.CREATE_COURSE_SUCCESS,
            data
        })
    }

    @Get()
    async findAllCourses(@Query() findAllCoursesDto: FindAllCourseDto) {
        const { courses, pagination } = await this.coursesService.findAllCourses(findAllCoursesDto)

        return new DataResponseWithPagination({
            message: CourseMessages.FIND_ALL_COURSES_SUCCESS,
            data: courses,
            pagination: pagination
        })
    }

    @Get('active')
    async findAllActiveCourses(@Query() findAllCoursesDto: FindAllCourseDto) {
        const { courses, pagination } =
            await this.coursesService.findAllActiveCourses(findAllCoursesDto)

        return new DataResponseWithPagination({
            message: CourseMessages.FIND_ALL_ACTIVE_COURSES_SUCCESS,
            data: courses,
            pagination: pagination
        })
    }

    @Patch('active/:id')
    async activeCourse(@Param('id') id: string) {
        await this.coursesService.activateCourse(id)

        return new DataResponse({
            message: CourseMessages.ACTIVATE_COURSE_SUCCESS
        })
    }

    @Patch('inactive/:id')
    async inActiveCourse(@Param('id') id: string) {
        await this.coursesService.inactiveCourse(id)

        return new DataResponse({
            message: CourseMessages.INACTIVATE_COURSE_SUCCESS
        })
    }

    @Patch('archive/:id')
    async archivedCourse(@Param('id') id: string) {
        await this.coursesService.archivedCourse(id)

        return new DataResponse({
            message: CourseMessages.ARCHIVE_COURSE_SUCCESS
        })
    }

    @Patch('unarchive/:id')
    async unarchiveCourse(@Param('id') id: string) {
        await this.coursesService.unarchiveCourse(id)

        return new DataResponse({
            message: CourseMessages.UNARCHIVE_COURSE_SUCCESS
        })
    }

    @Patch(':id')
    async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        await this.coursesService.updateCourse(id, updateCourseDto)

        return new DataResponse({
            message: CourseMessages.UPDATE_COURSE_SUCCESS
        })
    }

    @Delete(':id')
    async deleteCourse(@Param('id') id: string) {
        await this.coursesService.deleteCourse(id)

        return new DataResponse({
            message: CourseMessages.DELETE_COURSE_SUCCESS
        })
    }
}
