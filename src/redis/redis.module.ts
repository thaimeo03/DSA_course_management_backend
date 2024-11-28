import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async (configService: ConfigService) => {
                const client = new Redis({
                    host: configService.get('REDIS_HOST'),
                    port: +configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD')
                })
                const logger = new Logger('RedisModule')

                client.on('connect', () => {
                    logger.log('Connected to Redis')
                })

                client.on('error', (err) => {
                    logger.error(err)
                })

                return client
            },
            inject: [ConfigService]
        }
    ],
    exports: ['REDIS_CLIENT']
})
export class RedisModule {}
