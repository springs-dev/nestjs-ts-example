import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import moment from "moment";

import { UsersRolesEnum } from "../enumerables/users-roles.enum";
import { TokensDto } from "../dto/jwt/tokens.dto";
import { UserType } from "../../common/decorators/current-user.decorator";

export interface TokenPayload {
  userId?: number;
  role: UsersRolesEnum;
}

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService) {}
  async createTokens(
    role: UsersRolesEnum,
    userId?: number,
    refreshToken?: string,
  ): Promise<TokensDto> {
    const payload = {
      role,
      userId,
    };

    const tokens: Partial<TokensDto> = {
      accessToken: await this.jwt.signAsync(payload),
    };

    if (refreshToken) {
      tokens.refreshToken = refreshToken;
    } else {
      tokens.refreshToken = await this.jwt.signAsync(payload, {
        expiresIn: '7d',
      });
    }

    return tokens as TokensDto;
  }

  async refreshAccessToken(
    role: UsersRolesEnum,
    refreshToken,
  ): Promise<{
    tokens: TokensDto;
    payload: { userId?: number; role: UsersRolesEnum };
  }> {
    const refreshTokenPayload = await this.jwt.verifyAsync(refreshToken)
      .catch(() => { throw new UnauthorizedException('Token is not valid.') });

    if (refreshTokenPayload.role !== role) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: any = {
      role: refreshTokenPayload.role,
      userId: refreshTokenPayload.userId,
    };

    const decodedRefreshToken: any = await this.jwt.decode(refreshToken);
    const refreshExpirationDate = new Date(
      decodedRefreshToken.iat * 1000 + decodedRefreshToken.exp,
    );

    const remainingHours = moment().diff(refreshExpirationDate, 'hours');

    if (remainingHours >= 0 && remainingHours <= 12) {
      refreshToken = await this.jwt.signAsync(payload, {
        expiresIn: '7d',
      });
    }

    const tokens = {
      accessToken: await this.jwt.signAsync(payload),
      refreshToken,
    };

    return {
      tokens,
      payload,
    };
  }

  async verifyToken(token: string, role: UsersRolesEnum): Promise<UserType> {
    const { userId: id, role: userRole } = await this.jwt.verifyAsync<
      TokenPayload
    >(token, {
      ignoreExpiration: false,
    }).catch(() => { throw new UnauthorizedException('Token is not valid.') });


    if (userRole !== role) {
      throw new UnauthorizedException('Token is not valid.');
    }

    return { id, role: userRole };
  }

  async verifyTokenAndRoles(
    token: string,
    roles: UsersRolesEnum[],
  ): Promise<UserType> {
    const { userId: id = null, role: userRole } = await this.jwt.verifyAsync<
      TokenPayload
    >(token, {
      ignoreExpiration: false,
    }).catch(() => { throw new UnauthorizedException('Token is not valid.') });

    if (!roles.includes(userRole)) {
      throw new UnauthorizedException('Token is not valid.');
    }

    return { id, role: userRole };
  }
}
