// risk.service.ts
import { Injectable } from '@nestjs/common';
import { BehaviorService } from './behavior.service';

@Injectable()
export class RiskService {
  constructor(private readonly behavior: BehaviorService) {}

  async calculate(userId: string) {
    const data = await this.behavior.analyze(userId);

    let loanEligibility = 'low';

    if (data.behaviorScore > 75 && data.totalAssets > 500000) {
      loanEligibility = 'high';
    } else if (data.behaviorScore > 50) {
      loanEligibility = 'medium';
    }

    return {
      riskLevel: data.riskLevel,
      behaviorScore: data.behaviorScore,
      loanEligibility,
    };
  }
}