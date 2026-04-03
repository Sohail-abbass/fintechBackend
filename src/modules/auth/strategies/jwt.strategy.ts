import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

type AccessPayload = {
  sub?: string;
  email?: string;
  typ?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret =
      process.env.ACCESS_SECRET ?? 'dev-only-set-ACCESS_SECRET-in-production';

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };
    super(options);
  }

  validate(payload: AccessPayload) {
    if (
      payload?.typ !== 'access' ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string'
    ) {
      throw new UnauthorizedException('Invalid access token');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
