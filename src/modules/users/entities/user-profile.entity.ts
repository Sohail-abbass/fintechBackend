import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @Column({ name: 'monthly_income', type: 'numeric', default: 0 })
  monthlyIncome!: number;

  @Column({ name: 'employment_type', type: 'varchar', nullable: true })
  employmentType!: string | null;

  @Column({ type: 'numeric', default: 0 })
  savings!: number;
}
