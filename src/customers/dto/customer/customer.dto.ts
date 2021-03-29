import { ApiProperty } from '@nestjs/swagger';
import { CustomerEntity } from '../../entities/customer.entity';

export class CustomerDto implements CustomerEntity {
  @ApiProperty({ description: 'customer ID.' })
  id?: number;

  @ApiProperty({ description: 'customer email.' })
  email?: string;

  @ApiProperty({ description: 'customer name.' })
  name?: string;

  @ApiProperty({ description: 'customer address.' })
  address?: string;

  @ApiProperty({ description: 'customer phone number.' })
  phoneNumber?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
