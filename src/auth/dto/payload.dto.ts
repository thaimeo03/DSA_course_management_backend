import { Role } from 'common/enums/users.enum'

export class PayloadDto {
    userId: string
    role: Role
    verified: boolean
}
