import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';

export type UpsertUserProfileInput = {
  monthlyIncome: number;
  savings: number;
  employmentType?: string | null;
};

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profiles: Repository<UserProfile>,
  ) {}

  async upsert(userId: string, input: UpsertUserProfileInput): Promise<UserProfile> {
    const existing = await this.profiles.findOne({ where: { userId } });
    const payload = {
      userId,
      monthlyIncome: Number.isFinite(input.monthlyIncome) ? input.monthlyIncome : 0,
      savings: Number.isFinite(input.savings) ? input.savings : 0,
      employmentType: input.employmentType?.trim() || null,
    };
    const entity = existing ? this.profiles.merge(existing, payload) : this.profiles.create(payload);
    return this.profiles.save(entity);
  }

  findByUser(userId: string): Promise<UserProfile | null> {
    return this.profiles.findOne({ where: { userId } });
  }
}
