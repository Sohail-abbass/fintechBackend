import { Injectable } from '@nestjs/common';
import { BehaviorService } from './behavior.service';
import { PredictionService } from './prediction.service';

export type LoanDecision = {
  status: 'approved' | 'rejected' | 'conditional';
  approvedAmount: number;
  reason: string;
};

@Injectable()
export class LoanDecisionService {
  constructor(
    private readonly behavior: BehaviorService,
    private readonly prediction: PredictionService,
  ) {}

  async evaluate(
    userId: string,
    requestedAmount: number,
  ): Promise<LoanDecision> {
    const data = await this.behavior.analyze(userId);
    const forecast = await this.prediction.predict(userId);

    const { behaviorScore, totalAssets, monthlyIncome } = data;
    const { runOutDays } = forecast;

    // 🔥 RULE 1: HIGH RISK → REJECT
    if (behaviorScore < 35 && totalAssets < requestedAmount) {
      return {
        status: 'rejected',
        approvedAmount: 0,
        reason: 'High financial risk and insufficient assets',
      };
    }

    // 🔥 RULE 2: CASHFLOW DANGER → REJECT
    if (runOutDays !== -1 && runOutDays < 10) {
      return {
        status: 'rejected',
        approvedAmount: 0,
        reason: 'Cashflow unstable (money may run out soon)',
      };
    }

    // 🔥 RULE 3: STRONG PROFILE → APPROVE FULL
    if (behaviorScore > 75 && totalAssets > requestedAmount * 2) {
      return {
        status: 'approved',
        approvedAmount: requestedAmount,
        reason: 'Strong financial profile and asset backing',
      };
    }

    // 🔥 RULE 4: MEDIUM → PARTIAL APPROVAL
    const safeAmount = Math.min(
      requestedAmount,
      Math.floor(monthlyIncome * 3 + totalAssets * 0.2),
    );

    if (safeAmount > 0) {
      return {
        status: 'conditional',
        approvedAmount: safeAmount,
        reason: 'Moderate risk — limited approval based on capacity',
      };
    }

    return {
      status: 'rejected',
      approvedAmount: 0,
      reason: 'Insufficient financial strength',
    };
  }
}
