import { Controller, Get, Req, Post, UseGuards, Body } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BehaviorService } from './behavior.service';
import { InsightAIService } from './insight-ai.service';
import { PredictionService } from './prediction.service';
import { RiskService } from './risk.service';
import { LoanDecisionService } from './loan-decision.service';
type JwtUser = { userId: string; email: string };

@Controller('scoring')
@UseGuards(JwtAuthGuard)
export class ScoringController {
  constructor(
    private readonly behavior: BehaviorService,
    private readonly insights: InsightAIService,
    private readonly prediction: PredictionService,
    private readonly risk: RiskService,
    private readonly loanService: LoanDecisionService, // ✅ renamed
  ) {}

  @Get('me')
  async getMyScoring(@Req() req: Request & { user: JwtUser }) {
    const data = await this.behavior.analyze(req.user.userId);
    const ai = await this.insights.generateInsight(data);
    return { ...data, insights: ai };
  }

  @Get('behavior')
  behaviorOnly(@Req() req: Request & { user: JwtUser }) {
    return this.behavior.analyze(req.user.userId);
  }

  @Get('risk')
  riskOnly(@Req() req: Request & { user: JwtUser }) {
    return this.risk.calculate(req.user.userId);
  }

  @Get('prediction')
  predictionOnly(@Req() req: Request & { user: JwtUser }) {
    return this.prediction.predict(req.user.userId);
  }

  // ✅ FIXED METHOD NAME
  @Post('loan-decision')
  evaluateLoan(
    @Req() req: Request & { user: JwtUser },
    @Body() body: { amount: number },
  ) {
    return this.loanService.evaluate(req.user.userId, body.amount);
  }
}
