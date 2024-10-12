import { PayloadDto } from './payload.dto'

export class JwtPayloadDto extends PayloadDto {
    iat: number
    exp: number
}
