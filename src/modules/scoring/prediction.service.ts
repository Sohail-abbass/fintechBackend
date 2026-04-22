// prediction.service.ts
import { Injectable } from '@nestjs/common';
import { BehaviorService } from './behavior.service';

@Injectable()
export class PredictionService {
  constructor(private readonly behavior: BehaviorService) {}

  async predict(userId: string) {
    const data = await this.behavior.analyze(userId);

    const monthlyBurn = data.totalSpend;
    const dailyBurn = monthlyBurn / 30;

    const runOutDays =
      dailyBurn > 0 ? Math.floor(data.savings / dailyBurn) : -1;

    let status: 'stable' | 'warning' | 'critical' = 'stable';

    if (runOutDays >= 0 && runOutDays < 15) status = 'critical';
    else if (runOutDays < 45) status = 'warning';

    return {
      monthlyBurn,
      runOutDays,
      status,
    };
  }
}
