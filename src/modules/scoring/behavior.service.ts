// behavior.service.ts
import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transactions/transaction.service';
import { UserProfileService } from '../users/user-profile.service';
import { AssetsService } from '../assets/assets.service';

export type BehaviorAnalysis = {
  monthlyIncome: number;
  totalSpend: number;
  savings: number;
  totalAssets: number;
  behaviorScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  topCategory: string;
};

@Injectable()
export class BehaviorService {
  constructor(
    private readonly txService: TransactionService,
    private readonly profileService: UserProfileService,
    private readonly assetService: AssetsService,
  ) {}

  async analyze(userId: string): Promise<BehaviorAnalysis> {
    const txs = await this.txService.getUserTransactions(userId);
    const profile = await this.profileService.findByUser(userId);
    const assets = await this.assetService.findByUser(userId);

    const monthlyIncome = Number(profile?.monthlyIncome ?? 0);
    const savings = Number(profile?.savings ?? 0);

    const totalSpend = txs
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalAssets =
      Number(assets?.landValue ?? 0) +
      Number(assets?.carValue ?? 0) +
      Number(assets?.goldValue ?? 0) +
      Number(assets?.otherAssets ?? 0);

    const spendRatio = monthlyIncome > 0 ? totalSpend / monthlyIncome : 1;

    let score = 100;
    score -= spendRatio * 60;
    score += (savings / (monthlyIncome || 1)) * 20;
    score += totalAssets / 100000;

    const behaviorScore = Math.max(0, Math.min(100, Math.round(score)));

    const riskLevel =
      behaviorScore < 40 ? 'high' : behaviorScore < 70 ? 'medium' : 'low';

    const topCategory = this.getTopCategory(txs);

    return {
      monthlyIncome,
      totalSpend,
      savings,
      totalAssets,
      behaviorScore,
      riskLevel,
      topCategory,
    };
  }

  private getTopCategory(txs: any[]): string {
    const map: Record<string, number> = {};

    txs.forEach((t) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (t.type === 'debit') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  }
}