import { Module } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { Repository } from 'database/entities/repository.entity'
import { CloudRepository } from 'src/repositories/cloud.repository'

@Module({
    imports: [RepositoriesModule.register([Repository], [CloudRepository])],
    providers: [CloudinaryService],
    exports: [CloudinaryService]
})
export class CloudinaryModule {}
