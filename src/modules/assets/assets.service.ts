import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/assets.entity';
import { CreateAssetsDto } from './dto/create-assets.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {}

  // Added explicit return type here
  async create(userId: string, dto: CreateAssetsDto): Promise<Asset | null> {
    const existing = await this.assetRepo.findOne({ where: { userId } });

    if (existing) {
      await this.assetRepo.update(existing.id, dto);
      return this.assetRepo.findOne({ where: { id: existing.id } });
    }

    const asset = this.assetRepo.create({
      userId,
      ...dto,
    });

    return this.assetRepo.save(asset);
  }

  async findByUser(userId: string): Promise<Asset | null> {
    return this.assetRepo.findOne({ where: { userId } });
  }
}
