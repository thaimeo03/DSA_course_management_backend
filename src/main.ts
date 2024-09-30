import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT') || 9999
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new BaseExceptionFilter(httpAdapter)) // Exception filter is global
  app.useGlobalPipes(new ValidationPipe({ transform: true })) // Validation pipe is global
  app.use(cookieParser()) // Add cookie parser
  app.enableCors({ origin: [configService.get('CLIENT_URL')], credentials: true }) // Enable cors

  await app.listen(PORT)
}
bootstrap()
