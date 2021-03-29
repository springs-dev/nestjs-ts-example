import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { CustomerEntity } from '../../entities/customer.entity';

export class UpdateCustomerDto implements Partial<CustomerEntity> {
  @ApiPropertyOptional({ description: 'customer name.' })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'customer address.' })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'customer phone number.' })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  phoneNumber?: string;
}
