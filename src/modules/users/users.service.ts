import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  normalizeEmail(email: string) {
    return String(email ?? '')
      .trim()
      .toLowerCase();
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user = this.users.create({
      email: this.normalizeEmail(email),
      passwordHash,
    });
    return this.users.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  /** Email lookup for login (includes password hash). */
  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.users.findOne({
      where: { email: this.normalizeEmail(email) },
      select: ['id', 'email', 'passwordHash', 'createdAt', 'updatedAt'],
    });
  }

  toPublic(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getPublicByIdOrThrow(id: string): Promise<PublicUser> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toPublic(user);
  }
}
