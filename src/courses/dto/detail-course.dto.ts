import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class DetailCourseDto {
    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => Boolean(+value))
    isActive: boolean
}
