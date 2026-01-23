import { Injectable } from '@nestjs/common';
import { UserIntegrationsDao } from './dao';

@Injectable()
export class UserIntegrationsService {
    constructor(
        private readonly userIntegrationsDao: UserIntegrationsDao
    ) {}

    // public async create(
    //     data: 
    // )
}
