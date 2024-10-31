import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DBConfigService } from 'database/data-source'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ImagesModule } from './images/images.module'
import { CoursesModule } from './courses/courses.module'
import { LessonsModule } from './lessons/lessons.module'
import { DocumentsModule } from './documents/documents.module'
import { ProblemsModule } from './problems/problems.module'
import { TestSuitsModule } from './test-suits/test-suits.module'
import { TemplatesModule } from './templates/templates.module'
import { SubmissionsModule } from './submissions/submissions.module'
import { SourceCodesModule } from './source-codes/source-codes.module';
import { PointsModule } from './points/points.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env']
        }),
        TypeOrmModule.forRootAsync({
            useClass: DBConfigService
        }),
        UsersModule,
        AuthModule,
        ImagesModule,
        CoursesModule,
        LessonsModule,
        DocumentsModule,
        ProblemsModule,
        TestSuitsModule,
        TemplatesModule,
        SubmissionsModule,
        SourceCodesModule,
        PointsModule,
        PaymentsModule
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
