import { Request, Body, Controller, Get, Post } from '@nestjs/common';
import { UpdateUserIntegrationDto } from './dto/update-user-integration.dto';
import { UserIntegrationsService } from './user-integrations.service';
import { AuthRequestDto } from 'src/auth/dto';
import { UserIntegration } from './interfaces';

@Controller('user-integrations')
export class UserIntegrationsController {
    constructor(
        private readonly userIntegrationsService: UserIntegrationsService
    ) {}

    @Get()
    public async findAllByUserId(
        @Request() req: AuthRequestDto
    ): Promise<UserIntegration[]> {
        return await this.userIntegrationsService.findAllByUserId({
            user_id: req.user.sub
        });
    }

    @Post('update')
    public async update(
        @Body() body: UpdateUserIntegrationDto
    ): Promise<void> {
        await this.userIntegrationsService.update(body);
    }
}
