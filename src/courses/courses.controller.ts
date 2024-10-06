import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { DataResponse, DataResponseWithPagination } from 'common/core/response-success.core'
import { CourseMessages } from 'common/constants/messages/course.message'
import { FindAllCourseDto } from './dto/find-all-course.dto'

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

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.coursesService.deleteCourse(id)

    return new DataResponse({
      message: CourseMessages.DELETE_COURSE_SUCCESS
    })
  }
}
