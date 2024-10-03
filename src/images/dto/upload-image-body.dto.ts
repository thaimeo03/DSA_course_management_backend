import { IsEnum, IsNotEmpty } from 'class-validator'
import { CloudinaryImageFolder } from 'common/enums/images.enum'

export class UploadImageBodyDto {
  @IsNotEmpty()
  @IsEnum(CloudinaryImageFolder)
  cloudFolder: CloudinaryImageFolder
}
