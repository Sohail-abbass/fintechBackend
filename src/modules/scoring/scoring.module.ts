import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { BehaviorService } from './behavior.service';
import { InsightAIService } from './insight-ai.service';
import { PredictionService } from './prediction.service';
import { RiskService } from './risk.service';
import { ScoringController } from './scoring.controller';
import { AssetsModule } from '../assets/assets.module';
import { LoanDecisionService } from './loan-decision.service';
@Module({
  imports: [TransactionsModule, UsersModule, AssetsModule],
  controllers: [ScoringController],
  providers: [
    BehaviorService,
    InsightAIService,
    RiskService,
    PredictionService,
    LoanDecisionService, // ✅ ADD
  ],
  exports: [
    BehaviorService,
    InsightAIService,
    RiskService,
    PredictionService,
    LoanDecisionService,
  ],
})
export class ScoringModule {}
