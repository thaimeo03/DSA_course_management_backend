import { FileType } from 'common/enums/repository.enum'

export const CLOUDINARY_FOLDER_PATH: Record<FileType, string> = {
    [FileType.Image]: 'DSA_course_management_images',
    [FileType.Document]: 'DSA_course_management_documents'
}
