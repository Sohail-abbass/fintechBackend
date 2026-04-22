import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type TransactionType = 'credit' | 'debit';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ type: 'numeric' })
  amount!: number;

  @Column({ type: 'varchar' })
  type!: TransactionType;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'varchar' })
  merchant!: string;

  @Column({ type: 'date' })
  date!: string;
}
