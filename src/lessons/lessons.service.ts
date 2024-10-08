import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from 'database/entities/lesson.entity'
import { Repository } from 'typeorm'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { Course } from 'database/entities/course.entity'
import { CourseMessages } from 'common/constants/messages/course.message'
import * as _ from 'lodash'

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course) private courseRepository: Repository<Course>
  ) {}

  // 1. Check course exists
  // 2. Save lesson
  async createLesson(createLessonDto: CreateLessonDto) {
    // 1
    const course = await this.courseRepository.findOneBy({ id: createLessonDto.courseId })
    if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

    // 2
    const lesson = await this.lessonRepository.save({
      ...createLessonDto,
      course
    })

    return _.omit(lesson, ['course'])
  }
}
