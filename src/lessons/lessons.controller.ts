import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { DataResponse } from 'common/core/response-success.core'
import { LessonMessages } from 'common/constants/messages/lesson.message'
import { UpdateLessonDto } from './dto/update-lesson.dto'

@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    async createLesson(@Body() createLessonDto: CreateLessonDto) {
        const data = await this.lessonsService.createLesson(createLessonDto)

        return new DataResponse({ message: LessonMessages.CREATE_LESSON_SUCCESS, data })
    }

    @Get('/course/:courseId')
    async findLessonsByCourseId(@Param('courseId') courseId: string) {
        const data = await this.lessonsService.findLessonsByCourseId(courseId)

        return new DataResponse({ message: LessonMessages.FIND_LESSONS_BY_COURSE_SUCCESS, data })
    }

    @Get('/course/active/:courseId')
    async findActiveLessonsByCourseId(@Param('courseId') courseId: string) {
        const data = await this.lessonsService.findActiveLessonsByCourseId(courseId)

        return new DataResponse({
            message: LessonMessages.FIND_ACTIVE_LESSONS_BY_COURSE_SUCCESS,
            data
        })
    }

    @Patch('active/:id')
    async activeLesson(@Param('id') id: string) {
        await this.lessonsService.activeLesson(id)

        return new DataResponse({ message: LessonMessages.ACTIVATE_LESSON_SUCCESS })
    }

    @Patch('inactive/:id')
    async inactiveLesson(@Param('id') id: string) {
        await this.lessonsService.inactiveLesson(id)

        return new DataResponse({ message: LessonMessages.INACTIVATE_LESSON_SUCCESS })
    }

    @Patch('archive/:id')
    async archiveLesson(@Param('id') id: string) {
        await this.lessonsService.archiveLesson(id)

        return new DataResponse({ message: LessonMessages.ARCHIVE_LESSON_SUCCESS })
    }

    @Patch('unarchive/:id')
    async unarchiveLesson(@Param('id') id: string) {
        await this.lessonsService.unarchiveLesson(id)

        return new DataResponse({ message: LessonMessages.UNARCHIVE_LESSON_SUCCESS })
    }

    @Get(':id')
    async getLessonDetails(@Param('id') id: string) {
        const data = await this.lessonsService.getLessonDetails(id)

        return new DataResponse({ message: LessonMessages.GET_LESSON_DETAILS_SUCCESS, data })
    }

    @Patch(':id')
    async updateLesson(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        await this.lessonsService.updateLesson(id, updateLessonDto)

        return new DataResponse({ message: LessonMessages.UPDATE_LESSON_SUCCESS })
    }

    @Delete(':id')
    async deleteLesson(@Param('id') id: string) {
        await this.lessonsService.deleteLesson(id)

        return new DataResponse({ message: LessonMessages.DELETE_LESSON_SUCCESS })
    }
}
