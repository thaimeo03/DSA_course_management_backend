import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ROLES_KEY } from 'common/decorators/roles.de'
import { Role } from 'common/enums/users.enum'

/**
 * AuthGuard for validating access token sent in a cookie.
 *
 * @extends AuthGuard
 */
@Injectable()
export class AuthJwtGuard extends AuthGuard('authJwt') {
    private reflector = new Reflector()

    constructor() {
        super()
    }

    /**
     * Handles the request and validates the user.
     *
     * @returns {User} The user if valid, otherwise throws an exception.
     */
    handleRequest(err, user, info, context: ExecutionContext) {
        /**
         * If there is an error or the user is undefined, throw an exception.
         */
        if (err || !user) {
            throw err || new UnauthorizedException()
        }

        /**
         * Get roles from decorator and check if user has roles
         */
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        /**
         * If there are no roles, return the user.
         */
        if (!roles) return user

        /**
         * If the user does not have the required roles, throw an exception.
         */
        if (!roles.includes(user.role)) throw new ForbiddenException()

        /**
         * Return the user if valid.
         */
        return user
    }
}
