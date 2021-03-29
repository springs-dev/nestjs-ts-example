import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRolesEnum } from '../../auth/enumerables/users-roles.enum';
import { CustomersService } from '../services/customers.service';
import { UserType } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JwtCustomersStrategy extends PassportStrategy(
  Strategy,
  'jwt-customers',
) {
  constructor(private readonly customersService: CustomersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ userId: id, role }): Promise<UserType> {
    if (role !== UsersRolesEnum.CUSTOMER) {
      throw new HttpException(
        'Token payload is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (
      await this.customersService.isCustomerExist({
        id,
      })
    ) {
      return { id, role };
    }
    return null;
  }
}
