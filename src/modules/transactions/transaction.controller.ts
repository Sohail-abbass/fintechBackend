import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

type JwtUser = { userId: string; email: string };

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  create(@Body() body: CreateTransactionDto, @Req() req: Request & { user: JwtUser }) {
    return this.service.create(req.user.userId, body);
  }

  @Get('me')
  listMine(@Req() req: Request & { user: JwtUser }) {
    return this.service.getUserTransactions(req.user.userId);
  }
}