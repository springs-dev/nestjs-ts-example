import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CustomersService } from '../services/customers.service';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import { CustomerDto } from '../dto/customer/customer.dto';

@ApiBearerAuth()
@ApiTags('Customers Profile')
@UseGuards(AuthGuard('jwt-customers'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('customers/self')
export class CustomersSelfController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @ApiResponse({
    description: 'Customer info',
    type: CustomerDto,
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Get('')
  getCustomer(@CurrentUser() user): Promise<CustomerDto> {
    return this.customersService.findOne(
      {
        id: user.id,
      }
    );
  }

  @ApiResponse({
    description: 'Updated customer info',
    type: CustomerDto,
    status: HttpStatus.ACCEPTED,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('')
  async updateCustomer(
    @CurrentUser() user,
    @Body()
    payload: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    await this.customersService.updateCustomer(user.id, payload);

    return this.customersService.findOne(
      {
        id: user.id,
      }
    );
  }

}
