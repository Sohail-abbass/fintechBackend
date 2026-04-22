import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'float', default: 0 })
  landValue: number;

  @Column({ type: 'float', default: 0 })
  carValue: number;

  @Column({ type: 'float', default: 0 })
  goldValue: number;

  @Column({ type: 'float', default: 0 })
  otherAssets: number;
}
