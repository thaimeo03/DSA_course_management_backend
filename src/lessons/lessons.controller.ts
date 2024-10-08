import { Body, Controller, Post } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { DataResponse } from 'common/core/response-success.core'
import { LessonMessages } from 'common/constants/messages/lesson.message'

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    const data = await this.lessonsService.createLesson(createLessonDto)

    return new DataResponse({ message: LessonMessages.CREATE_LESSON_SUCCESS, data })
  }
}
