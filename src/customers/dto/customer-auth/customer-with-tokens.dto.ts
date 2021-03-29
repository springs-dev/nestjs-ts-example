import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { CustomerDto } from '../customer/customer.dto';
import { TokensDto } from '../../../auth/dto/jwt/tokens.dto';

export class CustomerWithTokensDto {
  @ApiProperty()
  @Expose({ groups: ['customer'] })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty()
  @Expose({ groups: ['customer'] })
  @Type(() => TokensDto)
  tokens: TokensDto;

  constructor(partial: Partial<CustomerWithTokensDto>) {
    Object.assign(this, partial);
  }
}
