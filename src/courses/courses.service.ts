import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { Repository } from 'typeorm'
import { CreateCourseDto } from './dto/create-course.dto'
import { CourseMessages } from 'common/constants/messages/course.message'

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private coursesRepository: Repository<Course>) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const course = await this.coursesRepository.save(createCourseDto)
    return course
  }

  // 1. Check course
  // 2. Delete course
  async deleteCourse(id: string) {
    // 1
    const course = await this.coursesRepository.findOneBy({ id })
    if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

    // 2
    await this.coursesRepository.delete(id)
  }
}
