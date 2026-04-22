import type { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  amount!: number;

  type!: TransactionType;

  category!: string;

  merchant!: string;

  date!: string;
}
