import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
  ) {}

  private validateCreateInput(
    data: CreateTransactionDto,
  ): CreateTransactionDto {
    if (typeof data.amount !== 'number' || !Number.isFinite(data.amount)) {
      throw new BadRequestException('amount must be a valid number');
    }
    if (data.amount <= 0) {
      throw new BadRequestException('amount must be greater than zero');
    }
    if (data.type !== 'credit' && data.type !== 'debit') {
      throw new BadRequestException('type must be credit or debit');
    }
    if (!data.category?.trim() || !data.merchant?.trim()) {
      throw new BadRequestException('category and merchant are required');
    }
    if (!data.date || Number.isNaN(Date.parse(data.date))) {
      throw new BadRequestException('date must be a valid ISO date');
    }
    return {
      amount: Number(data.amount),
      type: data.type,
      category: data.category.trim(),
      merchant: data.merchant.trim(),
      date: data.date,
    };
  }

  async create(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<Transaction> {
    const payload = this.validateCreateInput(data);
    const toCreate: DeepPartial<Transaction> = {
      userId,
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      merchant: payload.merchant,
      date: payload.date,
    };
    const tx = this.transactions.create(toCreate);
    return this.transactions.save(tx);
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactions.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }
}