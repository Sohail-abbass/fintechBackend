import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UserProfile } from './modules/users/entities/user-profile.entity';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { AssetsModule } from './modules/assets/assets.module';
import { Asset } from './modules/assets/entities/assets.entity';

function dbPort(): number {
  const p = parseInt(process.env.DB_PORT ?? '5432', 10);
  return Number.isNaN(p) ? 5432 : p;
}

function dbSynchronize(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.DB_SYNCHRONIZE !== 'false';
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: dbPort(),
      username: process.env.DB_USERNAME ?? 'admin',
      password: process.env.DB_PASSWORD ?? 'admin',
      database: process.env.DB_DATABASE ?? 'fintech',
      entities: [User, UserProfile, Transaction, Asset],
      synchronize: dbSynchronize(),
      logging: process.env.DB_LOGGING === 'true',
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    ScoringModule,
    AnalyticsModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
