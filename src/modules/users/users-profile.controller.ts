import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileService } from './user-profile.service';

type JwtUser = { userId: string; email: string };
type UpsertProfileDto = {
  monthlyIncome: number;
  savings: number;
  employmentType?: string;
};

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UsersProfileController {
  constructor(private readonly profiles: UserProfileService) {}

  @Post()
  createOrUpdate(
    @Body() body: UpsertProfileDto,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.profiles.upsert(req.user.userId, body);
  }

  @Get('me')
  getMine(@Req() req: Request & { user: JwtUser }) {
    return this.profiles.findByUser(req.user.userId);
  }
}
