import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository as Repo } from 'database/entities/repository.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CloudRepository extends Repository<Repo> {
    constructor(@InjectRepository(Repo) private repository: Repository<Repo>) {
        super(repository.target, repository.manager, repository.queryRunner)
    }
}
