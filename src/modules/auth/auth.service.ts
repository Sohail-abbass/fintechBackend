import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

type RefreshJwtPayload = {
  sub: string;
  email: string;
  typ: string;
};

const DUMMY_HASH =
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

function isRefreshPayload(data: unknown): data is RefreshJwtPayload {
  if (data === null || typeof data !== 'object') return false;
  const o = data as Record<string, unknown>;
  return (
    o.typ === 'refresh' &&
    typeof o.sub === 'string' &&
    typeof o.email === 'string'
  );
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private accessSecret() {
    return (
      process.env.ACCESS_SECRET ?? 'dev-only-set-ACCESS_SECRET-in-production'
    );
  }

  private refreshSecret() {
    return (
      process.env.REFRESH_SECRET ?? 'dev-only-set-REFRESH_SECRET-in-production'
    );
  }

  private normalizeEmail(email: string) {
    return this.usersService.normalizeEmail(email);
  }

  private assertCredentials(email: string, password: string) {
    const e = this.normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      throw new BadRequestException('Invalid email');
    }

    if (typeof password !== 'string' || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    return { email: e, password };
  }

  async register(dto: RegisterDto) {
    const { email, password } = this.assertCredentials(dto.email, dto.password);

    const existing = await this.usersService.findByEmailForAuth(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, passwordHash);

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const { email, password } = this.assertCredentials(dto.email, dto.password);
    const user = await this.usersService.findByEmailForAuth(email);
    const invalid = new UnauthorizedException('Invalid credentials');

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      throw invalid;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) throw invalid;

    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: unknown;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!isRefreshPayload(payload)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user.id, user.email);
  }

  generateTokens(userId: string, email: string) {
    const access_token = this.jwtService.sign(
      { sub: userId, email, typ: 'access' },
      { secret: this.accessSecret(), expiresIn: '15m' },
    );

    const refresh_token = this.jwtService.sign(
      { sub: userId, email, typ: 'refresh' },
      { secret: this.refreshSecret(), expiresIn: '7d' },
    );

    return { access_token, refresh_token };
  }
}
