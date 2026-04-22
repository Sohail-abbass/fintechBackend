import { BehaviorService } from '../scoring/behavior.service';
import { Injectable } from '@nestjs/common';

import { RiskService } from '../scoring/risk.service';
import { PredictionService } from '../scoring/prediction.service';
import { InsightAIService } from '../scoring/insight-ai.service';
import { LoanDecisionService } from '../scoring/loan-decision.service';
@Injectable()
export class AnalyticsService {
  constructor(
    private readonly behavior: BehaviorService,
    private readonly risk: RiskService,
    private readonly prediction: PredictionService,
    private readonly insights: InsightAIService,
    private readonly loan: LoanDecisionService,
  ) {}

  async getFullAnalytics(userId: string) {
    const behavior = await this.behavior.analyze(userId);
    const risk = await this.risk.calculate(userId);
    const prediction = await this.prediction.predict(userId);
    const insights = await this.insights.generateInsight(behavior);

    return {
      behavior,
      risk,
      prediction,
      insights,
    };
  }

  async getBehavior(userId: string) {
    return this.behavior.analyze(userId);
  }

  async getRisk(userId: string) {
    return this.risk.calculate(userId);
  }

  async getPrediction(userId: string) {
    return this.prediction.predict(userId);
  }

  async getInsights(userId: string) {
    const behavior = await this.behavior.analyze(userId);
    return this.insights.generateInsight(behavior);
  }

  async getLoanDecision(userId: string, amount: number) {
    return this.loan.evaluate(userId, amount);
  }
}
