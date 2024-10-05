import { Body, Controller, Post } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { DataResponse } from 'common/core/response-success.core'
import { CourseMessages } from 'common/constants/messages/course.message'

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
}
