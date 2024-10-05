import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { Repository } from 'typeorm'
import { CreateCourseDto } from './dto/create-course.dto'

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private coursesRepository: Repository<Course>) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const course = await this.coursesRepository.save(createCourseDto)
    return course
  }
}
