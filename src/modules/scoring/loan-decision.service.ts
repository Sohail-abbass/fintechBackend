import { Injectable } from '@nestjs/common';
import { BehaviorService, BehaviorAnalysis } from './behavior.service';
import { PredictionService } from './prediction.service';
import { RiskService } from './risk.service';

export type LoanDecision = {
  status: 'approved' | 'rejected' | 'conditional';
  approvedAmount: number;
  reason: string;
};

type RiskAnalysis = {
  riskLevel: string;
  behaviorScore: number;
  loanEligibility: string;
};

type CashflowAnalysis = {
  monthlyBurn: number;
  runOutDays: number;
  status: string;
};

@Injectable()
export class LoanDecisionService {
  constructor(
    private readonly behavior: BehaviorService,
    private readonly prediction: PredictionService,
    private readonly risk: RiskService,
  ) {}

  async evaluate(
    userId: string,
    requestedAmount: number,
  ): Promise<LoanDecision> {
    const behavior = await this.behavior.analyze(userId);
    const risk = await this.risk.calculate(userId);
    const cashflow = await this.prediction.predict(userId);

    // ✅ safe defaults (avoid undefined crash)
    const monthlyIncome = behavior?.monthlyIncome ?? 0;

    const behaviorScore = this.calculateBehaviorScore(behavior);
    const riskScore = this.calculateRiskScore(risk);
    const cashflowScore = this.calculateCashflowScore(cashflow);

    const totalScore =
      behaviorScore * 0.4 + riskScore * 0.3 + cashflowScore * 0.3;

    // ✅ FIX: more realistic thresholds (avoid always reject)
    if (totalScore >= 70 && monthlyIncome >= requestedAmount * 0.15) {
      return {
        status: 'approved',
        approvedAmount: requestedAmount,
        reason: 'Strong financial profile with stable income and low risk',
      };
    } else if (totalScore >= 50 && monthlyIncome >= requestedAmount * 0.08) {
      const approvedAmount = Math.min(
        requestedAmount,
        Math.floor(monthlyIncome * 3),
      );

      return {
        status: 'conditional',
        approvedAmount,
        reason: 'Moderate profile - partial approval recommended',
      };
    } else {
      return {
        status: 'rejected',
        approvedAmount: 0,
        reason: 'High risk or insufficient income stability',
      };
    }
  }

  private calculateBehaviorScore(behavior: BehaviorAnalysis): number {
    let score = behavior?.behaviorScore ?? 0;

    if ((behavior?.savings ?? 0) > (behavior?.monthlyIncome ?? 0) * 0.2) {
      score += 10;
    }

    if ((behavior?.totalAssets ?? 0) > 500000) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private calculateRiskScore(risk: RiskAnalysis): number {
    let baseScore = risk?.behaviorScore ?? 50;

    if (risk?.loanEligibility === 'high') {
      baseScore += 20;
    } else if (risk?.loanEligibility === 'low') {
      baseScore -= 20;
    }

    return Math.max(0, Math.min(100, baseScore));
  }

  private calculateCashflowScore(cashflow: CashflowAnalysis): number {
    const days = cashflow?.runOutDays ?? 0;

    if (days === -1) return 20;
    if (days < 30) return 40;
    if (days < 90) return 65;

    return 85;
  }
}
