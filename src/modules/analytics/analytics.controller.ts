import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

type JwtUser = { userId: string; email: string };

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview')
  overview(@Req() req: Request & { user: JwtUser }) {
    return this.analytics.getFullAnalytics(req.user.userId);
  }

  @Get('behavior')
  behavior(@Req() req: Request & { user: JwtUser }) {
    return this.analytics.getBehavior(req.user.userId);
  }

  @Get('risk')
  risk(@Req() req: Request & { user: JwtUser }) {
    return this.analytics.getRisk(req.user.userId);
  }

  @Get('cashflow')
  cashflow(@Req() req: Request & { user: JwtUser }) {
    return this.analytics.getPrediction(req.user.userId);
  }

  @Get('insights')
  insights(@Req() req: Request & { user: JwtUser }) {
    return this.analytics.getInsights(req.user.userId);
  }
}