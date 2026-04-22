import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { AssetsService } from './assets.service';
import { CreateAssetsDto } from './dto/create-assets.dto';
import { Asset } from './entities/assets.entity';

type JwtUser = { userId: string };

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateAssetsDto,
  ): Promise<Asset | null> {
    // Explicitly type the return here
    // Note: Changed from 'createOrUpdate' to 'create' to match your service
    return this.assetsService.create(req.user.userId, dto);
  }
}
