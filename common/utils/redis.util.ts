export class RedisUtil {
    static getRefreshTokenKey(userId: string) {
        return `user:${userId}:refresh_token`
    }
}
