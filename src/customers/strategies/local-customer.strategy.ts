import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { CryptoService } from '../../common/crypto/crypto.service';
import { UsersRolesEnum } from '../../auth/enumerables/users-roles.enum';
import { CustomersService } from '../services/customers.service';
import { UserType } from '../../common/decorators/current-user.decorator';

@Injectable()
export class LocalCustomersStrategy extends PassportStrategy(
  Strategy,
  'local-customers',
) {
  constructor(
    private readonly customersService: CustomersService,
    @Inject('CryptoService') private readonly cryptoService: CryptoService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email, password): Promise<UserType> {
    const customer = await this.customersService
      .findOne(
        {
          email: email.toLowerCase(),
        },
        {
          select: ['id', 'email', 'password'],
        },
      )
      .catch(e => {
        throw new BadRequestException('Customer with this email not exists.');
      });
    if (await this.cryptoService.compare(customer.password, password)) {
      return {
        id: customer.id,
        role: UsersRolesEnum.CUSTOMER,
      };
    } else {
      throw new BadRequestException('Password is not valid.');
    }
  }
}
