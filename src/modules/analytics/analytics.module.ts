import { Module } from '@nestjs/common';
import { ScoringModule } from '../scoring/scoring.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [TransactionsModule, UsersModule, ScoringModule, AssetsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
